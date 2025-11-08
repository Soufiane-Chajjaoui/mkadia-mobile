import { UserIcon, Phone, Save } from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Colors,
  Elevation,
  IconSize,
  Spacing,
  Typography,
} from '../../../../constants/DesignSystem';

interface UpdateFormProps {
  firstName: string;
  lastName: string;
  phone: string;
  saving: boolean;
  handleSave: () => void;
  onChangeFirstName: (text: string) => void;
  onChangeLastName: (text: string) => void;
  onChangePhone: (text: string) => void;
}

export const UpdateForm: React.FC<UpdateFormProps> = ({
  firstName,
  lastName,
  phone,
  saving,
  handleSave,
  onChangeFirstName,
  onChangeLastName,
  onChangePhone,
}) => {
  return (
    <>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Informations Personnelles</Text>

        {/* Prénom */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prénom</Text>
          <View style={styles.inputWrapper}>
            <UserIcon size={20} color={Colors.GRAY_TEXT} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={onChangeFirstName}
              placeholder="Entrez votre prénom"
              placeholderTextColor={Colors.GRAY_TEXT}
              editable={!saving}
            />
          </View>
        </View>

        {/* Nom */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom</Text>
          <View style={styles.inputWrapper}>
            <UserIcon size={20} color={Colors.GRAY_TEXT} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={onChangeLastName}
              placeholder="Entrez votre nom"
              placeholderTextColor={Colors.GRAY_TEXT}
              editable={!saving}
            />
          </View>
        </View>

        {/* Téléphone */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Téléphone</Text>
          <View style={styles.inputWrapper}>
            <Phone size={20} color={Colors.GRAY_TEXT} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={onChangePhone}
              placeholder="Entrez votre numéro (+212)"
              placeholderTextColor={Colors.GRAY_TEXT}
              keyboardType="number-pad"
              editable={!saving}
            />
          </View>
        </View>
      </View>

      {/* Bouton Enregistrer */}
      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
        activeOpacity={0.8}
      >
        {saving ? (
          <>
            <ActivityIndicator size="small" color={Colors.WHITE_ICON} />
            <Text style={styles.saveButtonText}>Enregistrement...</Text>
          </>
        ) : (
          <>
            <Save size={IconSize.MD} color={Colors.WHITE_ICON} />
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </>
        )}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
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
});
