import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList, BottomTabParamList } from '../types/navigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.warn('Navigation not ready yet');
  }
}

export function resetToLogin() {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }
}

export function navigateToTab(tabName: keyof BottomTabParamList) {
  if (navigationRef.isReady()) {
    navigationRef.navigate('MainTabs', { screen: tabName });
  } else {
    console.warn('Navigation not ready yet');
  }
}
