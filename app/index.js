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
  useEffect(() => {
    setIsLoggedin(true);
  }, []);

  return (
    <Stack.Navigator initialRouteName="Login"
      screenOptions={{
        headerShown: false
      }}
    >
      {isLoggedin ? (
        <>
          <Stack.Screen name="Home" {...props} loginAs={loginAs} setLoginAs={setLoginAs} isLoggedin={isLoggedin}
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
            options={{ headerShown: false }}
          >
            {props => (
              <RegistrationScreen 
                {...props}
                loginAs={loginAs}
                setLoginAs={setLoginAs}
                setIsLoggedin={setIsLoggedin}
              />
            )}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};

export default App;