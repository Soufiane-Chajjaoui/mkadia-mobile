import React from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Euro } from 'lucide-react-native';
import { Colors } from '../constants/DesignSystem';

interface PriceTextProps {
  amount: number;
  style?: TextStyle;
  iconSize?: number;
  iconColor?: string;
  containerStyle?: ViewStyle;
  showDecimals?: boolean;
}

const PriceText: React.FC<PriceTextProps> = ({
  amount,
  style,
  iconSize = 16,
  iconColor,
  containerStyle,
  showDecimals = true,
}) => {
  const formattedAmount = showDecimals 
    ? amount.toFixed(2) 
    : Math.round(amount).toString();

  // Extraire la couleur du style ou utiliser la couleur par défaut
  const textColor = (style as any)?.color || Colors.DARK_BLUE_TEXT;
  const finalIconColor = iconColor || textColor;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={style}>{formattedAmount}</Text>
      <Euro size={iconSize} color={finalIconColor} strokeWidth={2.5} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default PriceText;

