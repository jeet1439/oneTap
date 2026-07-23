import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import BottomTabs from "./BottomTabs";


const Stack = createNativeStackNavigator()


export default function RootStack() {
  return (
   <Stack.Navigator
     initialRouteName="Splash"
     screenOptions={{
      headerShown: false
     }}
   >
    <Stack.Screen name = 'Splash' component={SplashScreen}/>
    <Stack.Screen name = 'Login' component={LoginScreen}/>
    <Stack.Screen name = 'Signup' component={SignUpScreen}/>
    <Stack.Screen name= 'Main' component={BottomTabs}/>
   </Stack.Navigator>
  )
}