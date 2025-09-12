import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// ✅ Fonction typée pour navigate
export function navigate<T extends keyof RootStackParamList>(
  screen: T,
  params?: RootStackParamList[T]
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(screen as any, params as any);
  }
}

// ✅ Fonction pour reset la stack (utile pour login/logout)
export function resetToLogin() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  }
}