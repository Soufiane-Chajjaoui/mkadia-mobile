import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HelpCircle, LogOut } from 'lucide-react-native';
import { Colors, Spacing, IconSize, Elevation } from '../../../constants/DesignSystem';
import MenuItem from './MenuItem';

interface HelpLogoutSectionProps {
  onMenuPress: (screen: string) => void;
}

const HelpLogoutSection: React.FC<HelpLogoutSectionProps> = ({
  onMenuPress
}) => {
  return (
    <View style={styles.container}>
      {/* Section Centre d'aide */}
      <View style={styles.section}>
        <MenuItem
          icon={<HelpCircle size={IconSize.LG} color={Colors.WHITE_ICON} />}
          title="Centre d'aide"
          subtitle="Obtenez de l'aide et des réponses"
          onPress={() => onMenuPress('Centre d\'aide')}
        />

      {/* Section Déconnexion - visuellement distincte */}
        <MenuItem
          icon={<LogOut size={IconSize.LG} color={Colors.WHITE_ICON} />}
          title="Déconnexion"
          subtitle="Déconnectez-vous de votre compte"
          onPress={() => onMenuPress('Déconnexion')}
          showDivider={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.MD,
  },
  section: {
    backgroundColor: Colors.WHITE,
    overflow: 'hidden',
    marginBottom: Spacing.SM,
  },
  logoutSection: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.RED_BG,
  },
});

export default HelpLogoutSection;