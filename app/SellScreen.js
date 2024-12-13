import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from './sellscreen_style';

const SellScreen = () => {
  const [images, setImages] = useState([null, null, null]); // 3 image slots
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  const conditions = ['Like new', 'Good', 'Fair', 'Poor'];

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
      formData.append('title', title);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('condition', condition);
      formData.append('transaction_location', location);
      
      // Append the first image (required)
      const imageUri = images[0];
      const imageName = imageUri.split('/').pop();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: imageName,
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
        // Reset form
        setImages([null, null, null]);
        setTitle('');
        setDescription('');
        setPrice('');
        setCondition('');
        setPickupTime('');
        setLocation('');
        setCategory('');
      } else {
        throw new Error(data.message || 'Failed to list item');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to list item');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton}>
          <Text>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sell an Item</Text>
        <TouchableOpacity style={styles.listButton} onPress={handleSubmit}>
          <Text style={styles.listButtonText}>List</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.imageSection}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              style={styles.imageUpload}
              onPress={() => pickImage(index)}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.uploadedImage} />
              ) : (
                index === 0 ? (
                  <View style={styles.addPhotos}>
                    <Image 
                      source={require('./static/images/camera.png')}
                      style={styles.cameraIcon}
                    />
                    <Text style={styles.addPhotosText}>Add photos</Text>
                  </View>
                ) : (
                  <View style={styles.emptySlot} />
                )
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
                  condition === cond && styles.conditionButtonSelected
                ]}
                onPress={() => setCondition(cond)}
              >
                <Text style={[
                  styles.conditionButtonText,
                  condition === cond && styles.conditionButtonTextSelected
                ]}>{cond}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Pick up time availability</Text>
          <TextInput
            style={styles.input}
            placeholder="When are you available?"
            value={pickupTime}
            onChangeText={setPickupTime}
          />

          <Text style={styles.sectionTitle}>Pick up location</Text>
          <TextInput
            style={styles.input}
            placeholder="Where to meet?"
            value={location}
            onChangeText={setLocation}
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveDraftButton}>
        <Text style={styles.saveDraftText}>Save Draft</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SellScreen;