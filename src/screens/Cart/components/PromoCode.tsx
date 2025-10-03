import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated, Alert, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Tag } from 'lucide-react-native';
import { IconSize, Colors, Spacing, Typography, BorderRadius } from '../../../constants/DesignSystem';

interface PromoCodeProps {
  appliedPromo: {code: string; discount: number} | null;
  onApplyPromo: (promo: {code: string; discount: number}) => void;
  onRemovePromo: () => void;
  animatedValue: Animated.Value;
}

const PromoCodeComponent: React.FC<PromoCodeProps> = ({ 
  appliedPromo, 
  onApplyPromo, 
  onRemovePromo, 
  animatedValue 
}) => {
  const [promoCode, setPromoCode] = useState("");

  const handleApplyPromoCode = () => {
    if (promoCode.toLowerCase() === "save20") {
      onApplyPromo({ code: "SAVE20", discount: 20 });
      setPromoCode("");
      // Animation feedback
      Animated.sequence([
        Animated.timing(animatedValue, { toValue: 0.95, duration: 100, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 1, duration: 100, useNativeDriver: true })
      ]).start();
    } else {
      Alert.alert("Code invalide", "Veuillez saisir un code promo valide.");
    }
  };

  return (
    <View style={styles.promoContainer}>
      <View style={styles.promoTitleContainer}>
        <Tag size={IconSize.MD} color={Colors.GREEN_TEXT} />
        <Text style={styles.promoTitle}>Code Promo</Text>
      </View>
      {appliedPromo ? (
        <Animated.View style={[styles.appliedPromoContainer, { transform: [{ scale: animatedValue }] }]}>
          <View style={styles.appliedPromoInfo}>
            <Text style={styles.appliedPromoCode}>{appliedPromo.code}</Text>
            <Text style={styles.appliedPromoDiscount}>{appliedPromo.discount}% de réduction</Text>
          </View>
          <TouchableOpacity 
            onPress={onRemovePromo}
            activeOpacity={0.7}
          >
            <Text style={styles.removePromoText}>Supprimer</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <View style={styles.promoInputContainer}>
          <TextInput
            style={styles.promoInput}
            placeholder="Saisir le code promo"
            placeholderTextColor={Colors.GRAY_TEXT}
            value={promoCode}
            onChangeText={setPromoCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity 
            style={styles.applyPromoButton}
            onPress={handleApplyPromoCode}
            activeOpacity={0.8}
          >
            <Text style={styles.applyPromoText}>Appliquer</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  promoContainer: {
    backgroundColor: Colors.WHITE,
    marginTop: Spacing.XXS,
    padding: Spacing.LG,
    borderBottomWidth: 1,
    borderColor: Colors.LIGHT_GRAY_BG,
  } as ViewStyle,
  promoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.MD,
  } as ViewStyle,
  promoTitle: {
    ...Typography.SUBHEAD,
    color: Colors.DARK_BLUE_TEXT,
    marginLeft: Spacing.SM,
  } as TextStyle,
  appliedPromoContainer: {
    backgroundColor: Colors.DARK_GREEN_BG,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  appliedPromoInfo: {
    flex: 1,
  } as ViewStyle,
  appliedPromoCode: {
    ...Typography.SUBHEAD,
    color: Colors.WHITE_TEXT,
  } as TextStyle,
  appliedPromoDiscount: {
    ...Typography.CAPTION,
    color: Colors.WHITE_TEXT,
    marginTop: Spacing.XXS,
  } as TextStyle,
  removePromoText: {
    ...Typography.BODY,
    color: Colors.WHITE_TEXT,
  } as TextStyle,
  promoInputContainer: {
    flexDirection: 'row',
  } as ViewStyle,
  promoInput: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY_BG,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.MD,
    borderRadius: BorderRadius.SM,
    marginRight: Spacing.SM,
    ...Typography.BODY,
    color: Colors.DARK_BLUE_TEXT,
  } as any,
  applyPromoButton: {
    backgroundColor: Colors.GREEN_BG,
    paddingHorizontal: Spacing.XL,
    paddingVertical: Spacing.MD,
    borderRadius: BorderRadius.SM,
    justifyContent: 'center',
  } as ViewStyle,
  applyPromoText: {
    ...Typography.BODY,
    color: Colors.WHITE_TEXT,
  } as TextStyle,
});

export default PromoCodeComponent;