import 'react-native-get-random-values';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, SafeAreaView, Platform, Alert, StyleSheet, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from './sellscreen_style';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { FlatList } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';

const SellScreen = ({ navigation, route }) => {
  const { loginAs } = route.params;
  const [images, setImages] = useState([null, null, null]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState({latitude: null, longitude: null, place_address: null});
  const [category, setCategory] = useState('');
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.8075,
    longitude: -73.9626,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [timeRange, setTimeRange] = useState({
    start: null,
    end: null
  });
  const [showModal, setShowModal] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [currentPicking, setCurrentPicking] = useState(null);

  const conditions = ['Like new', 'Good', 'Fair', 'Poor'];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        console.log('Error getting location:', error);
        Alert.alert('Location Error', 'Could not get your current location');
      }
    })();
  }, []);

  const pickImage = async (index) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please enable photo library access to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = [...images];
      newImages[index] = result.assets[0].uri;
      setImages(newImages);
    }

  };



  const handleSubmit = async () => {
    if (!title || !description || !price || !condition || !location || !images[0]) {
      Alert.alert('Missing Information', 'Please fill in all required fields and add at least one image.');
      return;
    }

    try {
      const formData = new FormData();
      const locationString = JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude,
        place_address: location.place_address
      });
      formData.append('title', title);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('condition', condition);
      formData.append('transaction_location', locationString);
      formData.append('pickup_start_datetime', startDateTime ? startDateTime.toISOString() : '');
      formData.append('pickup_end_datetime', endDateTime ? endDateTime.toISOString() : '');
      formData.append('category', 1);
      formData.append('user_id', loginAs);


      images.forEach((imageUri, index) => {
        if (imageUri) {
          const imageName = imageUri.split('/').pop();
          const fileExtension = imageName.split('.').pop().toLowerCase();
          let mimeType;
          switch (fileExtension) {
            case 'jpg':
            case 'jpeg':
              mimeType = 'image/jpeg';
              break;
            case 'png':
              mimeType = 'image/png';
              break;
            case 'gif':
              mimeType = 'image/gif';
              break;
            case 'heic':
              mimeType = 'image/heic';
              break;
            default:
              mimeType = 'image/jpeg';
          }
      
          formData.append(`image${index + 1}`, {
            uri: imageUri,
            type: mimeType,
            name: imageName,
          });
        }
      });
      const response = await fetch('http://3.149.231.33/items', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Item listed successfully!');
        setImages([null, null, null]);
        setTitle('');
        setDescription('');
        setPrice('');
        setCondition('');
        setLocation('');
        setCategory('');
        route.params.onListingSuccess();
        navigation.goBack();
      } else {
        throw new Error(data.message || 'Failed to list item');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to list item');
    }
  };

  const handlePlaceSelect = (data, details = null) => {
    if (!details) {
      console.warn("Place details are null. Unable to update location.");
      return;
    }

    try {
      const { lat, lng } = details.geometry.location;
      
      const newLocation = {
        latitude: lat,
        longitude: lng,
        place_address: details.formatted_address
      };

      setSelectedLocation(newLocation);
      setLocation(newLocation);
      
      setMapRegion({
        ...newLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      console.log("Selected location:", newLocation);
    } catch (error) {
      console.error("Error handling place selection:", error.message);
    }
  };

  const formatDateTime = (date) => {
    if (!date) return 'Select time';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }} pointerEvents="box-none">
        <View style={styles.container} pointerEvents='box-none'>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <Text>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sell an Item</Text>
            <TouchableOpacity style={styles.listButton} onPress={handleSubmit}>
              <Text style={styles.listButtonText}>List</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={[{ key: 'content' }]}
            keyExtractor={(item) => item.key}
            keyboardShouldPersistTaps='handled'
            renderItem={() => (
              <>
                <View style={styles.imageSection}>
                  {images.map((image, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.imageUpload}
                      onPress={() => pickImage(index)}
                    >
                      {image ? (
                        <Image source={{ uri: image }} style={styles.uploadedImage} />
                      ) : index === 0 ? (
                        <View style={styles.addPhotos}>
                          <Image
                            source={require('./static/images/camera.png')}
                            style={styles.cameraIcon}
                          />
                          <Text style={styles.addPhotosText}>Add photos</Text>
                        </View>
                      ) : (
                        <View style={styles.emptySlot} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>



                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <TextInput
                    style={styles.titleInput}
                    placeholder="What are you selling?"
                    value={title}
                    onChangeText={setTitle}
                  />
                  <TextInput
                    style={styles.descriptionInput}
                    placeholder="Describe your item"
                    multiline
                    value={description}
                    onChangeText={setDescription}
                  />

                  <Text style={styles.sectionTitle}>Details</Text>
                  <View style={styles.priceInputContainer}>
                    <Text style={styles.dollarSign}>$</Text>
                    <TextInput
                      style={styles.priceInput}
                      placeholder="Price"
                      keyboardType="numeric"
                      value={price}
                      onChangeText={setPrice}
                    />
                  </View>

                  <Text style={styles.label}>Category</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Select a category"
                    value={category}
                    onChangeText={setCategory}
                  />

                  <View style={styles.conditionContainer}>
                    {conditions.map((cond) => (
                      <TouchableOpacity
                        key={cond}
                        style={[
                          styles.conditionButton,
                          condition === cond && styles.conditionButtonSelected,
                        ]}
                        onPress={() => setCondition(cond)}
                      >
                        <Text
                          style={[
                            styles.conditionButtonText,
                            condition === cond && styles.conditionButtonTextSelected,
                          ]}
                        >
                          {cond}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.sectionTitle}>Pick up time availability</Text>
                  <View style={styles.timePickerContainer}>
                    <View style={styles.timePickerHalf}>
                      <Text style={styles.timeLabel}>From</Text>
                      <TouchableOpacity
                        style={styles.timePickerButton}
                        onPress={() => {
                          setCurrentPicking('start');
                          setTempDate(timeRange.start || new Date());
                          setShowModal(true);
                        }}
                      >
                        <Text style={[styles.timeText, styles.centerText]}>
                          {formatDateTime(timeRange.start)}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.timePickerHalf}>
                      <Text style={styles.timeLabel}>To</Text>
                      <TouchableOpacity
                        style={[
                          styles.timePickerButton,
                          !timeRange.start && styles.timePickerButtonDisabled
                        ]}
                        onPress={() => {
                          if (!timeRange.start) {
                            Alert.alert('Error', 'Please select start time first');
                            return;
                          }
                          setCurrentPicking('end');
                          setTempDate(timeRange.end || timeRange.start);
                          setShowModal(true);
                        }}
                        disabled={!timeRange.start}
                      >
                        <Text style={[
                          styles.timeText,
                          styles.centerText,
                          !timeRange.start && styles.timeTextDisabled
                        ]}>
                          {formatDateTime(timeRange.end)}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Modal
                      visible={showModal}
                      transparent={true}
                      animationType="slide"
                    >
                      <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
                        <View style={styles.modalOverlay}>
                          <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                              <View style={styles.modalHeader}>
                                <TouchableOpacity
                                  style={styles.modalHeaderButton}
                                  onPress={() => setShowModal(false)}
                                >
                                  <Text style={styles.modalHeaderButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>
                                  Select {currentPicking === 'start' ? 'Start' : 'End'} Time
                                </Text>
                                <TouchableOpacity
                                  style={styles.modalHeaderButton}
                                  onPress={() => {
                                    setTimeRange(prev => ({
                                      ...prev,
                                      [currentPicking]: tempDate
                                    }));
                                    if (currentPicking === 'start') {
                                      setStartDateTime(tempDate);
                                    } else {
                                      setEndDateTime(tempDate);
                                    }
                                    setShowModal(false);
                                  }}
                                >
                                  <Text style={[styles.modalHeaderButtonText, styles.confirmText]}>Done</Text>
                                </TouchableOpacity>
                              </View>

                              <DateTimePicker
                                value={tempDate}
                                mode="datetime"
                                display="spinner"
                                onChange={(event, date) => {
                                  if (date) setTempDate(date);
                                }}
                                minimumDate={
                                  currentPicking === 'end' && timeRange.start
                                    ? timeRange.start
                                    : new Date()
                                }
                              />
                            </View>
                          </TouchableWithoutFeedback>
                        </View>
                      </TouchableWithoutFeedback>
                    </Modal>
                  </View>

                  <View style={styles.locationSection}>
                    <Text style={styles.sectionTitle}>Pick up location</Text>

                    <GooglePlacesAutocomplete
                      placeholder='Search for a location'
                      onPress={(data, details = null) => {
                        if (details) handlePlaceSelect(data, details);
                      }}
                      query={{
                        key: 'YOUR_TEMP_KEY_HERE_GOOGLE_API',
                        language: 'en',
                      }}
                      styles={{
                        container: styles.autocompleteContainer,
                        textInput: styles.searchInput,
                        listView: styles.searchResultsList,
                        row: styles.searchRow,
                        separator: styles.searchSeparator,
                      }}
                      fetchDetails={true}
                      enablePoweredByContainer={false}
                      keyboardShouldPersistTaps="handled"
                    />



                    <View style={styles.mapContainer}>
                      <MapView
                        style={styles.map}
                        region={mapRegion}
                        onRegionChange={setMapRegion}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                      >
                        {selectedLocation && (
                          <Marker
                            coordinate={selectedLocation}
                            draggable
                            onDragEnd={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
                          />
                        )}
                      </MapView>
                    </View>
                  </View>

                  {selectedLocation && (
                    <View style={styles.selectedLocationInfo}>
                      <Text>
                        Selected Location:{'\n'}
                        Latitude: {selectedLocation.latitude.toFixed(6)}{'\n'}
                        Longitude: {selectedLocation.longitude.toFixed(6)}
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}
          />

          <TouchableOpacity style={styles.saveDraftButton}>
            <Text style={styles.saveDraftText}>Save Draft</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );

};

export default SellScreen;