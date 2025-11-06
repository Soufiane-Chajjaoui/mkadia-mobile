import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Colors, Spacing } from '../../constants/DesignSystem';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { JwtService } from '../../services/JwtService';
import { logoutAsync } from '../../features/auth/authSlice';
import { CommonActions, useNavigation } from '@react-navigation/native';
import ProfileHeader from './components/ProfileHeader';
import ProfileUserInfo from './components/ProfileUserInfo';
import AccountSection from './components/AccountSection';
import HelpLogoutSection from './components/HelpLogoutSection';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  // Extraire les informations utilisateur du JWT
  const firstName = JwtService.getFirstName(accessToken) || '';
  const lastName = JwtService.getLastName(accessToken) || '';
  const email = JwtService.getUserEmail(accessToken) || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Utilisateur';

  // Gérer les clics sur les options du menu
  const handleMenuPress = (screen: string) => {
    if (screen === 'AccountInfo') {
      navigation.navigate('AccountInfo' as never);
    } else {
      Alert.alert('En développement', `La fonctionnalité "${screen}" sera bientôt disponible.`);
    }
    switch (screen) {
      case 'AccountInfo':
        navigation.navigate('AccountInfo' as never);
        break;
      case 'Centre d\'aide':
        Alert.alert('En développement', 'La fonctionnalité "Centre d\'aide" sera bientôt disponible.');
        break;
      case 'Déconnexion':
        Alert.alert('En développement', `La fonctionnalité "${screen}" sera bientôt disponible.`);
        break;
      default:
        Alert.alert('En développement', `La fonctionnalité "${screen}" sera bientôt disponible.`);
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <ProfileHeader title="Mon Profil" showSettings={false} onBackPress={() => navigation.goBack()} />

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
    backgroundColor: Colors.LIGHT_GRAY_BG,
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

