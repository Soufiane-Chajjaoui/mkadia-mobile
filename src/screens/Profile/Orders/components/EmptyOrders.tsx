import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import { Colors, Spacing, Typography, Elevation } from '../../../../constants/DesignSystem';

interface EmptyOrdersProps {
  onShopPress?: () => void;
}

const EmptyOrders: React.FC<EmptyOrdersProps> = ({ onShopPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <ShoppingBag size={64} color={Colors.GRAY_ICON} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>Aucune commande</Text>
      <Text style={styles.message}>
        Vous n'avez pas encore passé de commande.{'\n'}
        Commencez vos achats dès maintenant !
      </Text>
      {onShopPress && (
        <TouchableOpacity style={styles.button} onPress={onShopPress} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Découvrir nos produits</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.XL,
    paddingVertical: Spacing.XL * 2,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.LIGHT_GRAY_BG,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.LG,
  },
  title: {
    ...Typography.HEADLINE,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: Spacing.SM,
    textAlign: 'center',
  },
  message: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.XL,
  },
  button: {
    backgroundColor: Colors.GREEN_BG,
    paddingHorizontal: Spacing.XL,
    paddingVertical: Spacing.MD,
    borderRadius: 12,
    ...Elevation.MEDIUM,
  },
  buttonText: {
    ...Typography.SUBHEAD,
    color: Colors.WHITE_TEXT,
    fontWeight: '700',
    fontSize: 16,
  },
});

export default EmptyOrders;

