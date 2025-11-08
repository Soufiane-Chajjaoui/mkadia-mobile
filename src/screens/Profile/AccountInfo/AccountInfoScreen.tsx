import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Subscription } from 'rxjs';
import { getCurrentUser$, updateUser$ } from '../../../apis/UserAPI';
import { Colors, Typography, Spacing, Elevation } from '../../../constants/DesignSystem';
import { showGlobalError, showGlobalSuccess } from '../../../context/ToastContext';
import { UpdateUserRequest } from '../../../models/User';
import { RootStackParamList } from '../../../types/navigation';
import AppHeader from '../../../components/AppHeader';
import { UpdateForm } from './components/UpdateForm';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountInfo'>;

const AccountInfoScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    loadUserInfo();

    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, []);

  const loadUserInfo = () => {
    setLoading(true);
    subscriptionRef.current = getCurrentUser$().subscribe({
      next: (userData) => {
        console.log('✅ User data loaded:', userData);
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        setPhone(userData.phone || '');
        setLoading(false);
      },
      error: (error) => {
        console.error('❌ Error loading user:', error);
        showGlobalError(error.message || 'Erreur lors du chargement des informations');
        setLoading(false);
      },
    });
  };

  const handleSave = () => {
    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Erreur', 'Le prénom et le nom sont obligatoires');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Erreur', 'Le numéro de téléphone est obligatoire');
      return;
    }

    const payload: UpdateUserRequest = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
    };

    setSaving(true);
    subscriptionRef.current = updateUser$(payload).subscribe({
      next: (updatedUser) => {
        console.log('✅ User updated:', updatedUser);
        showGlobalSuccess('Informations mises à jour avec succès');
        setSaving(false);

        // Retourner à l'écran précédent après 500ms
        setTimeout(() => {
          navigation.goBack();
        }, 500);
      },
      error: (error) => {
        console.error('❌ Error updating user:', error);
        showGlobalError(error.message || 'Erreur lors de la mise à jour');
        setSaving(false);
      },
    });
  };


  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader title="Mon Compte" showSettings={false} onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.GREEN_BG} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader title="Mon Compte" showSettings={false} onBackPress={() => navigation.goBack()} />
      <UpdateForm
        firstName={firstName}
        lastName={lastName}
        phone={phone}
        saving={saving}
        handleSave={handleSave}
        onChangeFirstName={setFirstName}
        onChangeLastName={setLastName}
        onChangePhone={setPhone}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Text style={styles.infoIcon}>💡</Text>
          </View>
          <Text style={styles.infoText}>
            Vos modifications seront sauvegardées de manière sécurisée et appliquées immédiatement.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    marginTop: Spacing.MD,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.XL,
  },
  avatarSection: {
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    paddingVertical: Spacing.XL * 1.5,
    marginBottom: Spacing.LG,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Elevation.MEDIUM,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.MD,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.GREEN_BG,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.MEDIUM,
    borderWidth: 4,
    borderColor: Colors.WHITE,
  },
  avatarInitials: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.WHITE_TEXT,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.DARK_BLUE_TEXT,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.WHITE,
    ...Elevation.LOW,
  },
  userName: {
    ...Typography.HEADLINE,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: Spacing.XS,
  },
  userEmail: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    fontSize: 15,
  },
  formSection: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.LG,
    marginHorizontal: Spacing.MD,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: Spacing.LG,
    ...Elevation.LOW,
  },
  sectionTitle: {
    ...Typography.HEADLINE,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: Spacing.LG,
  },
  inputGroup: {
    marginBottom: Spacing.LG,
  },
  label: {
    ...Typography.SUBHEAD,
    fontWeight: '600',
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: Spacing.SM,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.LIGHT_GRAY_BG,
    paddingHorizontal: Spacing.MD,
  },
  inputIcon: {
    marginRight: Spacing.SM,
  },
  input: {
    ...Typography.BODY,
    flex: 1,
    paddingVertical: Spacing.MD,
    color: Colors.DARK_BLUE_TEXT,
    fontSize: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GREEN_BG,
    paddingVertical: Spacing.LG,
    marginHorizontal: Spacing.LG,
    borderRadius: 12,
    ...Elevation.MEDIUM,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    ...Typography.SUBHEAD,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.WHITE_TEXT,
    marginLeft: Spacing.SM,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.LG,
    marginHorizontal: Spacing.LG,
    marginTop: Spacing.MD,
    borderRadius: 12,
    ...Elevation.LOW,
    borderLeftWidth: 4,
    borderLeftColor: Colors.GREEN_BG,
  },
  infoIconContainer: {
    marginRight: Spacing.MD,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoText: {
    ...Typography.CAPTION,
    flex: 1,
    color: Colors.GRAY_TEXT,
    lineHeight: 20,
    fontSize: 14,
  },
  bottomSpacer: {
    height: Spacing.XL,
  },
});

export default AccountInfoScreen;