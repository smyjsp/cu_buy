import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import styles from './registration_style'; // Import styles from the external styles file
import * as ImagePicker from 'expo-image-picker';
import {Alert} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const RegistrationScreen = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [idImage, setIdImage] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [uni, setUni] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const openImagePicker = async () => {
    Alert.alert(
      'Select Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            
            if (permissionResult.granted === false) {
              alert("You need to enable camera permissions to take a photo");
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled) {
              setProfileImage(result.assets[0].uri);
            }
          }
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (permissionResult.granted === false) {
              alert("You need to enable photo library permissions to select a photo");
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled) {
              setProfileImage(result.assets[0].uri);
            }
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const openIDPicker = async () => {
    Alert.alert(
      'Upload CU ID',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            try {
              const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
              
              if (permissionResult.granted === false) {
                alert("You need to enable camera permissions to take a photo");
                return;
              }

              const result = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                quality: 1,
                exif: true, // Enable EXIF data
              });

              if (!result.canceled) {
                console.log('Original image:', result.assets[0]);
                
                // Always rotate the image to portrait
                const manipulatedImage = await ImageManipulator.manipulateAsync(
                  result.assets[0].uri,
                  [{ rotate: -90 }], // Try -90 degrees
                  { 
                    compress: 1,
                    format: ImageManipulator.SaveFormat.JPEG,
                  }
                );
                
                console.log('Manipulated image:', manipulatedImage);
                setIdImage(manipulatedImage.uri);
              }
            } catch (error) {
              console.log('Error handling image:', error);
            }
          }
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            try {
              const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
              
              if (permissionResult.granted === false) {
                alert("You need to enable photo library permissions to select a photo");
                return;
              }

              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
                exif: true, // Enable EXIF data
              });

              if (!result.canceled) {
                console.log('Original image:', result.assets[0]);
                
                // Always rotate the image to portrait
                const manipulatedImage = await ImageManipulator.manipulateAsync(
                  result.assets[0].uri,
                  [{ rotate: -90 }], // Try -90 degrees
                  { 
                    compress: 1,
                    format: ImageManipulator.SaveFormat.JPEG,
                  }
                );
                
                console.log('Manipulated image:', manipulatedImage);
                setIdImage(manipulatedImage.uri);
              }
            } catch (error) {
              console.log('Error handling image:', error);
            }
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const onRegister = async () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your Columbia/Barnard email');
      return;
    }
    if (!email.trim().endsWith('@columbia.edu')) {
      Alert.alert('Error', 'Please use a valid Columbia/Barnard email address');
      return;
    }
    if (!uni.trim()) {
      Alert.alert('Error', 'Please enter your UNI');
      return;
    }
    if (!profileImage) {
      Alert.alert('Error', 'Please upload a profile photo');
      return;
    }
    if (!idImage) {
      Alert.alert('Error', 'Please upload your CU ID');
      return;
    }

    try {
      // Show loading indicator
      setIsLoading(true);

      // Create form data for sending files
      const formData = new FormData();
      
      // Add text fields
      formData.append('firstName', firstName.trim());
      formData.append('lastName', lastName.trim());
      formData.append('email', email.trim());
      formData.append('uni', uni.trim());

      // Add profile image
      formData.append('profileImage', {
        uri: profileImage,
        type: 'image/jpeg',
        name: `${firstName}_${lastName}_${uni}.jpg`
      });

      // Add ID image
      formData.append('idImage', {
        uri: idImage,
        type: 'image/jpeg',
        name: 'id.jpg'
      });

      // Make API call to your backend
      const response = await fetch('http://3.149.231.33/register', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      alert(data.message);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.log('Error registering:', error);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('./static/images/logo.png')} // Replace with your logo URL
              style={styles.logo}
            />
            <Text style={styles.titleText}>CU Buy</Text>
            <Text style={styles.registrationText}>Registration</Text>
          </View>

          {/* Profile Picture Upload */}
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            style={styles.imageUploadContainer}
          >
            <TouchableOpacity 
              style={styles.imageUploadButton}
              onPress={openImagePicker}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                  onError={(error) => console.log('Image loading error:', error)}
                />
              ) : (
                <Image
                  source={require('./static/images/camera.png')}
                  style={styles.cameraIcon}
                />
              )}
            </TouchableOpacity>
          </Animatable.View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name (on your CU ID card)</Text>
            <TextInput style={styles.input} placeholder="Enter your first name" onChangeText={setFirstName} />

            <Text style={styles.label}>Last Name (on your CU ID card)</Text>
            <TextInput style={styles.input} placeholder="Enter your last name" onChangeText={setLastName} />

            <Text style={styles.label}>Columbia email</Text>
            <TextInput style={styles.input} placeholder="e.g. xx1234@columbia.edu" onChangeText={setEmail} />

            <Text style={styles.label}>UNI</Text>
            <TextInput style={styles.input} placeholder="Enter your UNI" onChangeText={setUni} />
          </View>

          {/* Upload CU ID */}
          <TouchableOpacity 
            style={styles.uploadContainer}
            onPress={openIDPicker}
          >
            {idImage ? (
              <View style={styles.idPreviewContainer}>
                <Image
                  source={{ uri: idImage }}
                  style={styles.idPreview}
                />
                <Text style={styles.changePhotoText}>Tap to change photo</Text>
              </View>
            ) : (
              <>
                <Image
                  source={require('./static/images/plus.png')}  // Make sure you have this icon
                  style={styles.uploadIcon}
                />
                <Text style={styles.uploadText}>Upload CU ID</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity style={styles.registerButton} onPress={onRegister}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
          
          {/* Add bottom padding for scrolling */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegistrationScreen;
