import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import HomePage from "./homepage"; // homepage screen
import RegistrationScreen from "./registration"; // registration screen
import LoginScreen from './LoginScreen'; // Your login screen
import SellScreen from './SellScreen'; // sell screen

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loginAs, setLoginAs] = useState('');
  // useEffect(() => {
  //   setIsLoggedin(true);
  // }, []);

  return (
    <Stack.Navigator initialRouteName="Login"
      screenOptions={{
        headerShown: false
      }}
    >
      {isLoggedin ? (
        <>
          <Stack.Screen 
            name="Home" 
            component={HomePage}
            initialParams={{ loginAs: loginAs, setLoginAs: setLoginAs, isLoggedin: isLoggedin }}
            screenOptions={{
              headerShown: false
            }}
          />
          <Stack.Screen 
            name="Sell" 
            component={SellScreen} 
            initialParams={{ loginAs: loginAs}}
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
            component={LoginScreen}
            initialParams={{ setIsLoggedin: setIsLoggedin, setLoginAs: setLoginAs }}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegistrationScreen}
            initialParams={{ loginAs: loginAs, setLoginAs: setLoginAs, setIsLoggedin: setIsLoggedin }}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default App;