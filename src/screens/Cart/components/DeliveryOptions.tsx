import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { IconSize, Colors, Spacing, Elevation, Typography } from '../../../constants/DesignSystem';

const DeliveryOptionsComponent: React.FC = () => {
  return (
    <View style={styles.deliveryContainer}>
      <View style={styles.deliveryTitleContainer}>
        <MapPin size={IconSize.MD} color={Colors.RED} />
        <Text style={styles.deliveryTitle}>Options de livraison</Text>
      </View>
      <View style={styles.deliveryOptions}>
        <Text style={styles.deliveryOption}>⚡ Livraison express : Moins de 10 minutes</Text>
        <Text style={styles.deliveryOption}>📦 Livraison standard : 1h</Text>
        <Text style={styles.deliveryOption}>🏪 Retrait en magasin : Disponible immédiatement</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  deliveryContainer: {
    backgroundColor: Colors.WHITE,
    marginTop: Spacing.XXS,
    padding: Spacing.LG,
    borderBottomWidth: 1,
    borderColor: Colors.LIGHT_GRAY_BG,
    ...Elevation.LOW,
  } as ViewStyle,
  deliveryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.MD,
  } as ViewStyle,
  deliveryTitle: {
    ...Typography.SUBHEAD,
    color: Colors.DARK_BLUE_TEXT,
    marginLeft: Spacing.SM,
  } as TextStyle,
  deliveryOptions: {} as ViewStyle,
  deliveryOption: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    marginBottom: Spacing.XS,
  } as TextStyle,
});

export default DeliveryOptionsComponent;
