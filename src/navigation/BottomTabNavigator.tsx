import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, User, Heart, Search } from 'lucide-react-native';
import { Colors, IconSize } from '../constants/DesignSystem';
import { BottomTabParamList } from '../types/navigation';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import HomeScreen from '../screens/Home/HomeScreen';
import { useAppSelector } from '../hooks/useRedux';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const withSafeArea = (ScreenComponent: React.ComponentType<any>) => {
  return (props: any) => (
    <SafeAreaWrapper>
      <ScreenComponent {...props} />
    </SafeAreaWrapper>
  );
};

// Placeholder screens
const SearchScreen = () => <SafeAreaWrapper><Text>Search</Text></SafeAreaWrapper>;
const FavoritesScreen = () => <SafeAreaWrapper><Text>Favoris Screen</Text></SafeAreaWrapper>;
const ProfileScreen = () => <SafeAreaWrapper><></></SafeAreaWrapper>;

export default function BottomTabNavigator() {
  const cartItems = useAppSelector(state => state.cart.items);
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.DARK_GREEN_BG,
        tabBarInactiveTintColor: Colors.GRAY_TEXT,
        tabBarStyle: {
          backgroundColor: Colors.WHITE,
          borderTopColor: Colors.LIGHT_GRAY_BG,
          height: 60,
          elevation:0,
          marginBottom: 15,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color }) => (
            <Home size={IconSize.LG} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Recherche',
          tabBarIcon: ({ color }) => (
            <Search size={IconSize.LG} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favoris',
          tabBarIcon: ({ color }) => (
            <Heart size={IconSize.LG} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => (
            <User size={IconSize.LG} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
