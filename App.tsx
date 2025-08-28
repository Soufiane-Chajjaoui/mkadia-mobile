/**
 * MKADIA Mobile App - INITIAL STATE
 *
 * This is the initial/starting state of the application.
 * The app is currently in its basic setup phase with default React Native components.
 *
 * TODO: Replace with actual app components and functionality
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Text, Image, Button } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import BootSplash from 'react-native-bootsplash';
import { useEffect } from 'react';
import TestLoggingComponent from './src/components/TestLoggingComponent';
import Logger from './src/utils/Logger';
import OnboardingScreen from './src/screens/Onboarding/OnboardingScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const init = async () => {
      // You can do some async operations here if needed
      // For example: await loadUserData();

      // Hide the bootsplash when the app is ready
      await BootSplash.hide({ fade: true });
    };

    init();
  }, []);

  return (
    <OnboardingScreen></OnboardingScreen>
  );
}


export default App;
