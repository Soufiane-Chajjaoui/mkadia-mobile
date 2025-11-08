import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Spacing } from '../../constants/DesignSystem';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { JwtService } from '../../services/JwtService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Subscription } from 'rxjs';
import { getCurrentUser$ } from '../../apis/UserAPI';
import AppHeader from '../../components/AppHeader';
import ProfileUserInfo from './components/ProfileUserInfo';
import AccountSection from './components/AccountSection';
import HelpLogoutSection from './components/HelpLogoutSection';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  // State pour les informations utilisateur
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const subscriptionRef = useRef<Subscription | null>(null);

  // Charger les informations utilisateur depuis le JWT au démarrage
  useEffect(() => {
    const jwtFirstName = JwtService.getFirstName(accessToken) || '';
    const jwtLastName = JwtService.getLastName(accessToken) || '';
    const jwtEmail = JwtService.getUserEmail(accessToken) || '';

    console.log('🔑 JWT Data:', { jwtFirstName, jwtLastName, jwtEmail });

    setFirstName(jwtFirstName);
    setLastName(jwtLastName);
    setEmail(jwtEmail);
  }, [accessToken]);

  // Recharger les données à chaque fois que l'écran est focus
  useFocusEffect(
    React.useCallback(() => {
      loadUserInfo();

      return () => {
        subscriptionRef.current?.unsubscribe();
      };
    }, [])
  );

  const loadUserInfo = () => {
    subscriptionRef.current = getCurrentUser$().subscribe({
      next: (userData) => {
        console.log('✅ Profile refreshed:', userData);
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        if (userData.email) {
          setEmail(userData.email);
        } else {
          const jwtEmail = JwtService.getUserEmail(accessToken) || '';
          console.log('📧 Email from JWT (fallback):', jwtEmail);
          setEmail(jwtEmail);
        }
      },
      error: (error) => {
        console.error('❌ Error loading user:', error);
        // En cas d'erreur, on garde les données du JWT
      },
    });
  };

  const fullName = `${firstName} ${lastName}`.trim() || 'Utilisateur';

  // Gérer les clics sur les options du menu
  const handleMenuPress = (screen: string) => {
    switch (screen) {
      case 'AccountInfo':
        navigation.navigate('AccountInfo' as never);
        break;
      case 'Orders':
        navigation.navigate('Orders' as never);
        break;
      case "Centre d'aide":
        Alert.alert('En développement', 'La fonctionnalité "Centre d\'aide" sera bientôt disponible.');
        break;
      default:
        Alert.alert('En développement', `La fonctionnalité "${screen}" sera bientôt disponible.`);
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader title="Mon Profil" showSettings={false} onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section Profil Utilisateur */}
        <ProfileUserInfo onEditPress={()=> handleMenuPress("AccountInfo")} fullName={fullName} email={email} />

        {/* Section Compte */}
        <AccountSection onMenuPress={handleMenuPress} />

        {/* Section Aide et Déconnexion */}
        <HelpLogoutSection
          onMenuPress={handleMenuPress}
        />
        {/* Espace en bas */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.LIGHT_GRAY_BG,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.XL,
  },
  bottomSpacer: {
    height: Spacing.XL,
  },
});

export default ProfileScreen;

