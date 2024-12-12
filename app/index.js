import React from 'react';
import LoginScreen from './LoginScreen'; // 您的登录页面
import { useState } from 'react';


const App = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  return <LoginScreen isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin}/>;
}

export default App;
