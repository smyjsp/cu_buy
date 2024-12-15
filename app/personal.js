import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
    RefreshControl,
} from 'react-native';
import styles from './personalcss';

const Personal = ({ navigation, route }) => {
    const loginAs = route.params?.loginAs;
    const setIsLoggedin = route.params?.setIsLoggedin || (() => {});
    const setLoginAs = route.params?.setLoginAs || (() => {});
    const [userListings, setUserListings] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    

    const fetchUserInfo = async () => {
        try {
            if (!loginAs) {
                Alert.alert('Please log in to view your listings');
                return;
            }

            const response = await fetch(`http://3.149.231.33/user/${loginAs}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setUserInfo(data);
        } catch (error) {
            console.error('Error fetching user info:', error);
            Alert.alert('Error', 'Failed to load user information');
        }
    };

    const fetchUserListings = async () => {
        try {
            if (!loginAs) {
                Alert.alert('Error', 'User not logged in');
                return;
            }

            const response = await fetch(`http://3.149.231.33/user/${loginAs}/items`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!Array.isArray(data)) {
                console.error('Received non-array data:', data);
                setUserListings([]);
                return;
            }

            setUserListings(data);
        } catch (error) {
            console.error('Error fetching user listings:', error);
            Alert.alert('Error', 'Failed to load your listings');
            setUserListings([]);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([fetchUserInfo(), fetchUserListings()]);
        setRefreshing(false);
    };

    useEffect(() => {
        fetchUserInfo();
        fetchUserListings();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (route.params?.refresh) {
                fetchUserListings();
                navigation.setParams({ refresh: undefined });
            }
        });

        return unsubscribe;
    }, [navigation, route.params?.refresh]);

    const handleLogout = () => {
        if (typeof setIsLoggedin === 'function' && typeof setLoginAs === 'function') {
            setIsLoggedin(false);
            setLoginAs(null);
        } else {
            console.error('Logout functions not available');
        }
    };

    const renderItem = ({ item }) => {
        const formattedItem = {
            ...item,
            images: item.images.map(img => 
                img.startsWith('data:') ? img : `data:image/jpeg;base64,${img}`
            ),
            location: typeof item.location === 'string' 
                ? item.location 
                : JSON.stringify({
                    latitude: item.location.latitude,
                    longitude: item.location.longitude,
                    place_address: item.location.place_address,
                    formatted_address: item.location.formatted_address
                  }),
            coordinates: {   
                latitude: item.location.latitude || 0,
                longitude: item.location.longitude || 0
            }
        };
        
        return (
            <TouchableOpacity 
                style={styles.listingItem}
                onPress={() => navigation.navigate('ItemDetail', { item: formattedItem })}
            >
                <Image 
                    source={{ 
                        uri: item.images[0].startsWith('data:') 
                            ? item.images[0] 
                            : `data:image/jpeg;base64,${item.images[0]}`
                    }}
                    style={styles.listingImage}
                    resizeMode="cover"
                />
                <View style={styles.listingInfo}>
                    <Text style={styles.listingTitle}>{item.title}</Text>
                    <Text style={styles.listingPrice}>${item.price}</Text>
                    <Text style={styles.listingStatus}>Status: {item.sold ? 'Sold' : 'Available'}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <View style={styles.mainContainer}>
                <View style={styles.contentContainer}>
                    <FlatList
                        ListHeaderComponent={() => (
                            <>
                                {userInfo && (
                                    <View style={styles.profileSection}>
                                        <Image
                                            source={{ 
                                                uri: userInfo.profile_image.startsWith('data:') 
                                                    ? userInfo.profile_image 
                                                    : `data:image/jpeg;base64,${userInfo.profile_image}`
                                            }}
                                            style={styles.profileImage}
                                        />
                                        <View style={styles.profileInfo}>
                                            <Text style={styles.userName}>{userInfo.username}</Text>
                                            <Text style={styles.userEmail}>{userInfo.email}</Text>
                                            <Text style={styles.universityName}>Columbia University</Text>
                                        </View>
                                    </View>
                                )}
                                <Text style={styles.sectionTitle}>My Listings</Text>
                            </>
                        )}
                        data={userListings}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No listings found</Text>
                        }
                        style={styles.listingsContainer}
                    />
                </View>

                <View style={styles.logoutSection}>
                    <TouchableOpacity 
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Personal;