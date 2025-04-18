import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./src/app/login/page";
import HomePage from "./src/app/page";
import OnboardingPage from "./src/app/onboarding/page";
import DashboardPage from "./src/app/dashboard/page";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Onboarding" component={OnboardingPage} />
        <Stack.Screen name="Dashboard" component={DashboardPage } />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
