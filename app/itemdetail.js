import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions,
  Alert,
  Linking,
  Platform,
  StatusBar
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import styles from './itemdetailcss';
const ItemDetail = ({ route, navigation }) => {
  const { item } = route.params;
  const { loginAs } = route.params;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (item.location) {
      try {
        const locationObj = typeof item.location === 'string' 
          ? JSON.parse(item.location) 
          : item.location;
        setLocation(locationObj);
      } catch (error) {
        console.error('Error parsing location:', error);
      }
    }
  }, [item]);

  const handleContactSeller = async () => {
    try {
        // Get user info from server
        const response = await fetch(`http://3.149.231.33/user/${item.seller_id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const seller_info = await response.json();
        Alert.alert(
            'Contact Seller',
            'Would you like to email the seller?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Email',
                    onPress: () => {
                        const subject = encodeURIComponent(`Regarding your listing: ${item.title}`);
                        const body = encodeURIComponent(
                            `Hi,\n\nI'm interested in your listing "${item.title}" priced at $${item.price}.\n\nBest regards`
                        );
                        Linking.openURL(`mailto:${seller_info.email}?subject=${subject}&body=${body}`);
                    }
                }
            ]
        );
    } catch (error) {
        console.error('Error fetching seller info:', error);
        Alert.alert('Error', 'Unable to contact seller at this time');
    }
  };

  const handleMarkAsSold = async () => {
    try {
        const response = await fetch(`http://3.149.231.33/items/${item.id}/sold`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            Alert.alert('Success', 'Item marked as sold');
            navigation.navigate('Personal', { loginAs: loginAs, refresh: true });
        } else {
            Alert.alert('Error', 'Failed to mark item as sold');
        }
    } catch (error) {
        console.error('Error marking item as sold:', error);
        Alert.alert('Error', 'Failed to mark item as sold');
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  console.log('Current user (loginAs):', loginAs);
  console.log('Item seller (user_id):', item.user_id);

  return (
    <View style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Item Details</Text>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / Dimensions.get('window').width
              );
              setCurrentImageIndex(newIndex);
            }}
          >
            {item.images.map((image, index) => (
              <Image
                key={index}
                source={{ 
                  uri: image.startsWith('data:') 
                    ? image 
                    : `data:image/jpeg;base64,${image}`
                }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          <View style={styles.indicatorContainer}>
            {item.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.condition}>Condition: {item.condition}</Text>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        <View style={styles.pickupSection}>
          <Text style={styles.sectionTitle}>Pickup Time</Text>
          <Text style={styles.pickupTime}>From: {formatDateTime(item.pickup_start_datetime)}</Text>
          <Text style={styles.pickupTime}>To: {formatDateTime(item.pickup_end_datetime)}</Text>
        </View>

        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Pickup Location</Text>
          <Text style={styles.address}>{location?.place_address}</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location?.latitude,
                longitude: location?.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location?.latitude,
                  longitude: location?.longitude,
                }}
              />
            </MapView>
          </View>
        </View>

        <View style={styles.buttonSection}>
          {loginAs === item.user_id ? (
            <TouchableOpacity 
              style={[styles.contactButton, { backgroundColor: '#4CAF50' }]}
              onPress={handleMarkAsSold}
            >
              <Text style={styles.contactButtonText}>Mark as Sold</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={handleContactSeller}
            >
              <Text style={styles.contactButtonText}>Contact Seller</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ItemDetail;