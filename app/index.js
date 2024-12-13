import { View, Text, Image, ScrollView } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import HomePage from "./homepage"; // homepage screen
import RegistrationScreen from "./registration"; // registration screen
import LoginScreen from './LoginScreen'; // Your login screen
import SellScreen from './SellScreen'; // sell screen

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);

  return (
    <Stack.Navigator initialRouteName="Login"
      screenOptions={{
        headerShown: false
      }}
    >
      {isLoggedin ? (
        <>
          <Stack.Screen name="Home" component={HomePage} 
            screenOptions={{
              headerShown: false
            }}
          />
          <Stack.Screen name="Sell" component={SellScreen} 
            options={{
                presentation: 'modal',
                animation: 'slide_from_bottom'
            }}
            screenOptions={{
              headerShown: false
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen 
            name="Login" 
            options={{ headerShown: false }}>
            {props => (
              <LoginScreen 
                {...props}
                setIsLoggedin={setIsLoggedin}
              />
            )}
          </Stack.Screen>
          <Stack.Screen 
            name="Register" 
            component={RegistrationScreen} 
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default App;