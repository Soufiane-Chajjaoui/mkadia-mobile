import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Bell, ShoppingBag } from 'lucide-react-native';
import { 
  Colors, 
  Spacing, 
  BorderRadius, 
  Typography, 
  IconSize,
  Elevation 
} from '../../../constants/DesignSystem';

interface HeaderProps {
  cartCount: number;
  hasNotification: boolean;
  location: string;
  onCartPress?: () => void;
  onNotificationPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  hasNotification, 
  location,
  onCartPress,
  onNotificationPress
}) => {
  return (
    <View style={styles.header}>
      {/* Section gauche - Texte de bienvenue et localisation */}
      <View style={styles.leftSection}>
        <Text style={styles.welcomeText}>Bonjour 👋</Text>
        <View style={styles.locationContainer}>
          <MapPin 
            size={IconSize.SM} 
            color={Colors.GREEN_BG} 
            accessibilityLabel="Localisation"
          />
          <Text 
            style={styles.locationText} 
            numberOfLines={1}
            accessibilityLabel={`Localisation: ${location}`}
          >
            {location}
          </Text>
        </View>
      </View>
      
      {/* Section droite - Icônes d'actions */}
      <View style={styles.rightSection}>
        {/* Bouton panier */}
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onCartPress}
          activeOpacity={0.7}
          accessibilityLabel="Panier"
          accessibilityHint={`${cartCount} article${cartCount !== 1 ? 's' : ''} dans le panier`}
          accessibilityRole="button"
        >
          <ShoppingBag 
            size={IconSize.LG} 
            color={Colors.DARK_BLUE_TEXT} 
            accessibilityLabel="Icône panier"
          />
          {cartCount > 0 && (
            <View style={styles.cartBadge} accessibilityLabel={`${cartCount} articles`}>
              <Text style={styles.cartBadgeText}>
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Bouton notifications */}
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
          accessibilityLabel="Notifications"
          accessibilityHint={hasNotification ? "Nouvelles notifications disponibles" : "Aucune nouvelle notification"}
          accessibilityRole="button"
        >
          <Bell 
            size={IconSize.LG} 
            color={Colors.DARK_BLUE_TEXT} 
            accessibilityLabel="Icône notifications"
          />
          {hasNotification && (
            <View 
              style={styles.notificationBadge} 
              accessibilityLabel="Nouvelle notification"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: Spacing.XL,
    paddingHorizontal: Spacing.XS,
    marginTop: Spacing.SM
  },
  leftSection: {
    flex: 1,
    marginRight: Spacing.MD,
  },
  welcomeText: {
    ...Typography.HEADLINE,
    color: Colors.DARK_BLUE_TEXT,
  },
  locationContainer: { 
    flexDirection: "row", 
    alignItems: "center",
    marginTop: Spacing.XS,
  },
  locationText: { 
    marginLeft: Spacing.XS, 
    ...Typography.BODY,
    color: Colors.GREEN_BG,
    flexShrink: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.MD,
  },
  iconButton: {
    position: "relative",
    padding: Spacing.MD,
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: BorderRadius.LG,
    ...Elevation.LOW,
  },
  cartBadge: {
    position: "absolute",
    top: Spacing.XS,
    right: Spacing.XS,
    backgroundColor: Colors.RED_BG,
    borderRadius: BorderRadius.CIRCULAR,
    minWidth: Spacing.LG,
    height: Spacing.LG,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.XXS,
    ...Elevation.MEDIUM,
  },
  cartBadgeText: {
    ...Typography.BADGE,
    color: Colors.WHITE_TEXT,
    textAlign: 'center',
    minWidth: Spacing.SM,
  },
  notificationBadge: { 
    position: "absolute", 
    top: Spacing.SM,
    right: Spacing.SM,
    width: Spacing.MD,
    height: Spacing.MD,
    borderRadius: BorderRadius.CIRCULAR, 
    backgroundColor: Colors.RED_BG,
    ...Elevation.MEDIUM,
  },
});

export default Header;