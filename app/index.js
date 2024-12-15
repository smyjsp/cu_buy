import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import HomePage from "./homepage"; // homepage screen
import RegistrationScreen from "./registration"; // registration screen
import LoginScreen from './LoginScreen'; // Your login screen
import SellScreen from './SellScreen'; // sell screen
import ItemDetail from './itemdetail';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loginAs, setLoginAs] = useState('');

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false, // Disable headers globally for all screens
      }}
    >
      {isLoggedin ? (
        <>
          <Stack.Screen 
            name="Home" 
            component={HomePage}
            initialParams={{ loginAs: loginAs, setLoginAs: setLoginAs, isLoggedin: isLoggedin }}
          />
          <Stack.Screen 
            name="Sell" 
            component={SellScreen} 
            initialParams={{ loginAs: loginAs }}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen 
            name="ItemDetail" 
            component={ItemDetail}
          />
        </>
      ) : (
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            initialParams={{ setIsLoggedin: setIsLoggedin, setLoginAs: setLoginAs }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegistrationScreen}
            initialParams={{ loginAs: loginAs, setLoginAs: setLoginAs, setIsLoggedin: setIsLoggedin }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default App;
