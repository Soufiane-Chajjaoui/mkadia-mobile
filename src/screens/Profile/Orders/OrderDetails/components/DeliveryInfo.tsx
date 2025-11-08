import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, User, Mail, Phone } from 'lucide-react-native';
import { Colors, Spacing, Typography, Elevation, BorderRadius } from '../../../../../constants/DesignSystem';
import { OrderDelivery, OrderAddress } from '../../../../../models/Order';

interface DeliveryInfoProps {
  delivery: OrderDelivery | null;
  address: OrderAddress;
}

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ delivery, address }) => {
  return (
    <View style={styles.container}>
      {/* Informations de livraison */}
      {delivery && (
        <>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={20} color={Colors.DARK_BLUE_TEXT} strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>Informations de livraison</Text>
            </View>

            <View style={styles.infoRow}>
              <User size={16} color={Colors.GRAY_ICON} />
              <Text style={styles.infoText}>
                {delivery.firstName} {delivery.lastName}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Mail size={16} color={Colors.GRAY_ICON} />
              <Text style={styles.infoText}>{delivery.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Phone size={16} color={Colors.GRAY_ICON} />
              <Text style={styles.infoText}>{delivery.phone}</Text>
            </View>
          </View>

          {/* Adresse de livraison */}
          <View style={styles.divider} />
        </>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MapPin size={20} color={Colors.DARK_BLUE_TEXT} strokeWidth={2.5} />
          <Text style={styles.sectionTitle}>Adresse de livraison</Text>
        </View>

        <View style={styles.addressCard}>
          <Text style={styles.addressText}>{address.addressLine1}</Text>
          <Text style={styles.addressText}>
            {address.city}, {address.codePostal}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    borderRadius: BorderRadius.LG,
    padding: Spacing.LG,
    marginHorizontal: Spacing.MD,
    marginTop: Spacing.MD,
    ...Elevation.LOW,
  },
  section: {
    marginBottom: Spacing.SM,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.MD,
    gap: Spacing.SM,
  },
  sectionTitle: {
    ...Typography.HEADLINE,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.DARK_BLUE_TEXT,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.SM,
    gap: Spacing.SM,
  },
  infoText: {
    ...Typography.BODY,
    color: Colors.DARK_BLUE_TEXT,
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.LIGHT_GRAY_BG,
    marginVertical: Spacing.MD,
  },
  addressCard: {
    backgroundColor: Colors.LIGHT_GRAY_BG,
    padding: Spacing.MD,
    borderRadius: BorderRadius.MD,
    borderLeftWidth: 3,
    borderLeftColor: Colors.GREEN_BG,
  },
  addressText: {
    ...Typography.BODY,
    color: Colors.DARK_BLUE_TEXT,
    fontSize: 15,
    lineHeight: 22,
  },
});

export default DeliveryInfo;

