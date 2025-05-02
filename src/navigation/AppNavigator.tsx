import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from '../app/login/page';
import OnboardingPage from '../app/onboarding/page';
import HomePage from '../app/page';
import ProfilePage from '../app/profile/page';
import EditProfilePage from '../app/profile/edit/page';
import ForgotPasswordPage from '../app/forgot-password/page';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Onboarding" component={OnboardingPage} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
      <Stack.Screen name="MainApp" component={BottomTabNavigator} />
      <Stack.Screen name="Profile" component={ProfilePage} />
      <Stack.Screen name="EditProfile" component={EditProfilePage} />
    </Stack.Navigator>
  );
} 