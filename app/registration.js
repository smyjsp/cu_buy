import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import styles from './registration_style'; // Import styles from the external styles file
import * as ImagePicker from 'expo-image-picker';
import {Alert} from 'react-native';

const RegistrationScreen = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [idImage, setIdImage] = useState(null);

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
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            
            if (permissionResult.granted === false) {
              alert("You need to enable camera permissions to take a photo");
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              quality: 0.8,
            });

            if (!result.canceled) {
              setIdImage(result.assets[0].uri);
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
              quality: 0.8,
            });

            if (!result.canceled) {
              setIdImage(result.assets[0].uri);
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
            <TextInput style={styles.input} placeholder="Enter your first name" />

            <Text style={styles.label}>Last Name (on your CU ID card)</Text>
            <TextInput style={styles.input} placeholder="Enter your last name" />

            <Text style={styles.label}>Columbia email</Text>
            <TextInput style={styles.input} placeholder="e.g. xx1234@columbia.edu" />

            <Text style={styles.label}>UNI</Text>
            <TextInput style={styles.input} placeholder="Enter your UNI" />
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
          <TouchableOpacity style={styles.registerButton}>
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
