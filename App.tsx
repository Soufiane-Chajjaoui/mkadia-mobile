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

import { useColorScheme} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigation';
import useFirstLaunch from './src/hooks/useFirstLaunch';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { isFirstLaunch, loading } = useFirstLaunch();

  useEffect(() => {
    const init = async () => {
      // You can do some async operations here if needed
      // For example: await loadUserData();

      // Hide the bootsplash when the app is ready
      await BootSplash.hide({ fade: true });
    };
    console.log("isFirstLaunch", isFirstLaunch);

    init();
  }, []);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}


export default App;
