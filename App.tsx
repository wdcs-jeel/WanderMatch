import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import LoginPage from './src/app/login/page';
import OnboardingPage from './src/app/onboarding/page';
import ForgotPasswordPage from './src/app/forgot-password/page';
import HomePage from './src/app/page';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Onboarding" component={OnboardingPage} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
          <Stack.Screen name="MainApp" component={BottomTabNavigator} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
    </SafeAreaView>
  );
}
