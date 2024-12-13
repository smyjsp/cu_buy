import { View, Text, Image, ScrollView } from "react-native";
import HomePage from "./HomePage";
import React, { useState } from 'react';
import LoginScreen from './LoginScreen'; // Your login screen

export default function Index() {
  const [isLoggedin, setIsLoggedin] = useState(true);

  if (isLoggedin) {
    return <HomePage />; // Show HomePage when logged in
  } else {
    return <LoginScreen isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin} />; // Show LoginScreen when not logged in
  }
}


// Testing SellScreen only

// import React from 'react';
// import SellScreen from './SellScreen';

// export default function Index() {
//   return <SellScreen />;
// }