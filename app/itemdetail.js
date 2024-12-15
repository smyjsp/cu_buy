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
  Linking
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
        console.log('Item title:', item.title, typeof item.location);
        console.log('Item location:', item.location, typeof item.location);
        const locationObj = JSON.parse(item.location);
        console.log('After parsing:', locationObj, typeof locationObj);
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
            navigation.goBack();
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

  return (
    <ScrollView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Image carousel */}
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
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        {/* Image indicators */}
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

      {/* Item details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.condition}>Condition: {item.condition}</Text>
        
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{item.description}</Text>

        <Text style={styles.sectionTitle}>Pickup Time</Text>
        <Text style={styles.pickupTime}>
          From: {formatDateTime(item.pickup_start_datetime)}
        </Text>
        <Text style={styles.pickupTime}>
          To: {formatDateTime(item.pickup_end_datetime)}
        </Text>

        <Text style={styles.sectionTitle}>Pickup Location</Text>
        {location ? (
          <Text style={styles.address}>
            {location.place_address ? location.place_address : 
             (location.formatted_address ? location.formatted_address : "Address not available")}
          </Text>
        ) : (
          <Text style={styles.address}>Loading address...</Text>
        )}
        {location && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
              />
            </MapView>
          </View>
        )}

        {/* Conditional rendering of bottom button */}
        {loginAs === item.seller_id ? (
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
  );
};

export default ItemDetail;