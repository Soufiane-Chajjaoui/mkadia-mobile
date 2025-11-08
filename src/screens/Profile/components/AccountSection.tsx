import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserCircle, Package, MapPin, Settings, UserLock } from 'lucide-react-native';
import { Colors, Spacing, Typography, IconSize, Elevation } from '../../../constants/DesignSystem';
import MenuItem from './MenuItem';

interface AccountSectionProps {
  onMenuPress: (screen: string) => void;
}

const AccountSection: React.FC<AccountSectionProps> = ({ onMenuPress }) => {
  return (
    <View style={styles.container}>
      {/* En-tête de section avec fond coloré */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Compte</Text>
      </View>

      {/* Contenu des menus */}
      <View style={styles.menuContainer}>
        <MenuItem
          icon={<UserCircle size={IconSize.LG} color={Colors.WHITE_ICON} />}
          title="Informations de compte"
          subtitle="Gérez vos informations personnelles"
          onPress={() => onMenuPress('AccountInfo')}
        />

        <MenuItem
          icon={<Package size={IconSize.LG} color={Colors.WHITE_ICON} />}
          title="Mes commandes"
          subtitle="Suivez vos commandes et historique"
          onPress={() => onMenuPress('Orders')}
        />

        <MenuItem
          icon={<MapPin size={IconSize.LG} color={Colors.WHITE_ICON} />}
          title="Gestion des adresses"
          subtitle="Ajoutez ou modifiez vos adresses"
          onPress={() => onMenuPress('Gestion des adresses')}
        />

        <MenuItem
          icon={<Settings size={IconSize.LG} color={Colors.WHITE_ICON} />}
          title="Paramètres"
          subtitle="Personnalisez votre expérience"
          onPress={() => onMenuPress('Paramètres')}
        />

        <MenuItem
          icon={<UserLock size={IconSize.LG} color={Colors.WHITE_ICON} />}
          title="Sécurité du compte"
          subtitle="Mot de passe et authentification"
          onPress={() => onMenuPress('Sécurité du compte')}
          showDivider={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    marginBottom: Spacing.MD,
    overflow: 'hidden'
  },
  sectionHeader: {
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
    borderBottomWidth: 1,
    borderBottomColor: Colors.WHITE,
  },
  sectionTitle: {
    ...Typography.SUBHEAD,
    color: Colors.DARK_BLUE_TEXT,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  menuContainer: {
    paddingVertical: Spacing.XS,
  },
});

export default AccountSection;