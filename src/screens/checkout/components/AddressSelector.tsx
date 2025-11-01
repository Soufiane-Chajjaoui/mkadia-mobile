// screens/Checkout/components/AddressSelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MapPin, Plus, Trash2, Star } from 'lucide-react-native';
import { DeliveryAddress } from '../../../types/CheckoutTypes';

interface AddressSelectorProps {
  addresses: DeliveryAddress[];
  selectedAddress: DeliveryAddress | null;
  onSelectAddress: (address: DeliveryAddress) => void;
  onAddNew: () => void;
  onDelete?: (addressId: string) => void;
  loading?: boolean;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddNew,
  onDelete,
  loading = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Choisir une adresse</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
          {/* ✅ Bouton Ajouter une nouvelle adresse */}
          <TouchableOpacity style={styles.addCard} onPress={onAddNew} activeOpacity={0.7}>
            <View style={styles.addIconContainer}>
              <Plus size={24} color="#3B82F6" />
            </View>
            <Text style={styles.addText}>Nouvelle{'\n'}adresse</Text>
          </TouchableOpacity>

          {/* ✅ Liste des adresses */}
          {addresses.map((address) => {
            const isSelected = selectedAddress?.id === address.id;
            
            return (
              <View key={address.id} style={styles.cardWrapper}>
                <TouchableOpacity
                  style={[styles.addressCard, isSelected && styles.addressCardSelected]}
                  onPress={() => onSelectAddress(address)}
                  activeOpacity={0.7}
                >
                  {/* Badge par défaut */}
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.defaultText}>Défaut</Text>
                    </View>
                  )}

                  {/* Label */}
                  {address.label && (
                    <Text style={styles.label}>{address.label}</Text>
                  )}

                  {/* Adresse */}
                  <View style={styles.addressContent}>
                    <MapPin size={16} color={isSelected ? '#3B82F6' : '#6B7280'} />
                    <View style={styles.addressTextContainer}>
                      <Text style={[styles.addressLine, isSelected && styles.addressLineSelected]} numberOfLines={1}>
                        {address.addressLine1}
                      </Text>
                      <Text style={styles.addressCity} numberOfLines={1}>
                        {address.codePostal} {address.city}
                      </Text>
                      <Text style={styles.addressPhone} numberOfLines={1}>
                        {address.phone}
                      </Text>
                    </View>
                  </View>

                  {/* Indicateur de sélection */}
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>

                {/* Bouton supprimer */}
                {onDelete && !address.isDefault && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete(address.id!)}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  scrollView: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 14,
  },
  cardWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  addCard: {
    width: 140,
    height: 140,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#EFF6FF',
  },
  addIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
    textAlign: 'center',
  },
  addressCard: {
    width: 180,
    minHeight: 140,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  addressCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#F59E0B',
    marginLeft: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  addressContent: {
    flexDirection: 'row',
    flex: 1,
  },
  addressTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  addressLine: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  addressLineSelected: {
    color: '#1F2937',
  },
  addressCity: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 12,
    right: 12,
  },
  radioSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F6',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddressSelector;