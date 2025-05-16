import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ApolloProvider } from '@apollo/client';
import AppNavigator from './src/navigation/AppNavigator';
import { client } from './src/utils/GraphQl/querytypes';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import {navigationRef} from './src/services/navigationService'
export default function App() {
  return (
    <ApolloProvider client={client}>
      <SafeAreaView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer ref={navigationRef}>
            <Provider store={store}>
              <AppNavigator></AppNavigator>
            </Provider>
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaView>
    </ApolloProvider>
  );
}
