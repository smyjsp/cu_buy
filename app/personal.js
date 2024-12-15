import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
    RefreshControl
} from 'react-native';

const Personal = ({ navigation, route }) => {
    const loginAs = route.params.loginAs;
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

    const handleLogout = () => {
        route.params.setIsLoggedin(false);
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
                    <Text style={styles.listingStatus}>Status: {item.status}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

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
            
            <FlatList
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

            <View style={styles.logoutSection}>
                <TouchableOpacity 
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: 50, // Adjust for status bar
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    profileSection: {
        backgroundColor: '#fff',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 10,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    universityName: {
        fontSize: 16,
        color: '#4a90e2',
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 15,
        backgroundColor: '#fff',
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    listingsContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listingItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    listingImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    listingInfo: {
        marginLeft: 15,
        flex: 1,
    },
    listingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    listingPrice: {
        fontSize: 15,
        color: '#2e7d32',
        fontWeight: '600',
        marginBottom: 4,
    },
    listingStatus: {
        fontSize: 14,
        color: '#666',
    },
    logoutSection: {
        padding: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    logoutButton: {
        backgroundColor: '#ff4444',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 32,
        color: '#666',
        fontSize: 16,
    },
});

export default Personal;
