import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '../../../constants/DesignSystem';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  onPress: () => void;
  showDivider?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  backgroundColor = Colors.GREEN_BG,
  onPress,
  showDivider = true
}) => {
  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          {/* Icône avec background coloré */}
          <View style={[styles.iconContainer, { backgroundColor }]}>
            {icon}
          </View>
          
          {/* Texte */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && (
              <Text style={styles.subtitle}>{subtitle}</Text>
            )}
          </View>
          
          {/* Chevron */}
          <View style={styles.chevronContainer}>
            <ChevronRight size={20} color={Colors.GRAY_TEXT} />
          </View>
        </View>
      </TouchableOpacity>
      
      {/* Séparateur */}
      {showDivider && <View style={styles.divider} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.MD,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...Typography.BODY,
    color: Colors.DARK_BLUE_TEXT,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  subtitle: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    fontSize: 13,
  },
  chevronContainer: {
    marginLeft: Spacing.SM,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.GRAY_TEXT,
    marginLeft: Spacing.LG + 44 + Spacing.MD, // Alignement avec le texte
    marginRight: Spacing.LG,
  },
});

export default MenuItem;