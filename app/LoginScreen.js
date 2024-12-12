import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import styles from './registration_style'; // Import styles from the external styles file

const LoginScreen = ({isLoggedin, setIsLoggedin}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
  
    setIsLoading(true);
  
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
  
    try {
      const response = await fetch('http://3.149.231.33/login', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Success', 'Login successful');
        setIsLoggedin(true);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Login failed');
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
            <Text style={styles.titleText}>Login</Text>
          </View>

          {/* Input Fields */}
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            style={styles.inputContainer}
          >
            <Text style={styles.label}>Email</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. xx1234@columbia.edu" 
              onChangeText={setEmail} 
              keyboardType="email-address" 
              autoCapitalize="none" 
            />

            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter your password" 
              onChangeText={setPassword} 
              secureTextEntry={true}
            />
          </Animatable.View>

          {/* Login Button */}
          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={onLogin}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Add bottom padding for scrolling */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
