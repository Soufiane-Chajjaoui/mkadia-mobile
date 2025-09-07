import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Package, Calendar, Asterisk, Globe2, Tags, Boxes } from "lucide-react-native";
import { IconSize, Colors, Spacing, Typography, BorderRadius } from "../../../constants/DesignSystem";

interface ProductDetailedInfoProps {
  brand?: string;
  origin?: string;
  quantity?: number;
  unit?: string;
  expirationDate?: string;
  stock?: number;
  sku?: string;
}

const ProductDetailedInfo: React.FC<ProductDetailedInfoProps> = ({
  brand,
  origin,
  quantity,
  unit,
  expirationDate,
  stock,
  sku
}) => {
  const infoItems = [
    { icon: Tags, label: "Marque", value: brand },
    { icon: Globe2, label: "Origine", value: origin },
    { icon: Package, label: "Quantité", value: quantity && unit ? `${quantity} ${unit}` : undefined },
    { icon: Calendar, label: "Date d'expiration", value: expirationDate ? new Date(expirationDate).toLocaleDateString('fr-FR') : undefined },
    { icon: Boxes, label: "Stock disponible", value: stock !== undefined ? `${stock} ${unit}` : undefined },
    { icon: Asterisk, label: "Référence", value: sku },
  ].filter(item => item.value); // Filtrer les éléments vides

  if (infoItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Informations détaillées</Text>
      
      <View style={styles.infoGrid}>
        {infoItems.map((item, index) => (
          <View key={index} style={styles.infoItem}>
            <item.icon size={IconSize.SM} color={Colors.GRAY_TEXT} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={[
                styles.infoValue,
                item.label === "Stock disponible" && stock !== undefined && stock <= 10 && {
                  color: stock > 0 ? Colors.ORANGE_TEXT : Colors.RED_ICON
                }
              ]}>
                {item.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: Spacing.LG,
    marginBottom: Spacing.LG,
  },
  sectionTitle: {
    ...Typography.SUBHEAD,
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: Spacing.MD,
  },
  infoGrid: {
    gap: Spacing.MD,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.MD,
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: BorderRadius.SM,
  },
  infoContent: {
    marginLeft: Spacing.SM,
    flex: 1,
  },
  infoLabel: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    marginBottom: Spacing.XXS,
  },
  infoValue: {
    ...Typography.BODY,
    color: Colors.DARK_BLUE_TEXT,
    fontWeight: '600',
  },
});

export default ProductDetailedInfo;