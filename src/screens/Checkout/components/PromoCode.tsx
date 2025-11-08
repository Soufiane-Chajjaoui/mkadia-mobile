import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Tag, X, CheckCircle, Percent, AlertCircle } from 'lucide-react-native';
import { CouponResponse } from '../../../apis/CheckoutAPI';

// ============================================
// TYPES
// ============================================

interface PromoCodeProps {
  appliedPromo: CouponResponse | null;
  onApplyPromo: (code: string) => void;
  onRemovePromo: () => void;
  animatedValue: Animated.Value;
  isLoading?: boolean;
  error?: string | null;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================
const PromoCodeComponent: React.FC<PromoCodeProps> = ({
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
  animatedValue,
  isLoading = false,
  error = null,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  // ============================================
  // HANDLERS
  // ============================================
  const handleApplyPromoCode = () => {
    // Validation
    if (!promoCode.trim()) {
      setLocalError('Veuillez saisir un code promo');
      return;
    }

    if (promoCode.trim().length < 3) {
      setLocalError('Le code promo est trop court');
      return;
    }

    setLocalError(null);
    onApplyPromo(promoCode.trim().toUpperCase());
    setPromoCode('');
  };

  const handleRemovePromo = () => {
    onRemovePromo();
    setLocalError(null);
  };

  const handleInputChange = (text: string) => {
    setPromoCode(text);
    setLocalError(null);
  };

  // ============================================
  // FORMATAGE
  // ============================================
  const formatDiscount = (promo: CouponResponse) => {
    if (promo.discountType === 'PERCENTAGE') {
      return `${promo.discountPercentage || promo.discountValue}% de réduction`;
    } else if (promo.discountType === 'FIXED') {
      return `${promo.discountValue!.toFixed(2)} € de réduction`;
    } else if (promo.discountType === 'FREE_DELIVERY') {
      return 'Livraison gratuite';
    }
    return `${promo.discountValue!.toFixed(2)} € de réduction`;
  };

  const formatSavedAmount = (promo: CouponResponse) => {
    if (promo.discountType === 'FREE_DELIVERY') {
      return 'Économie de frais de livraison';
    }
    return `Vous économisez ${promo.discountValue!.toFixed(2)} €`;
  };

  const displayError = localError || error;
  const isButtonDisabled = isLoading || !promoCode.trim();

  // ============================================
  // RENDER
  // ============================================
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Tag size={20} color="#059669" />
          <Text style={styles.title}>Code Promo</Text>
        </View>
        {appliedPromo && (
          <View style={styles.appliedBadge}>
            <CheckCircle size={14} color="#FFFFFF" />
            <Text style={styles.appliedBadgeText}>Appliqué</Text>
          </View>
        )}
      </View>

      {appliedPromo ? (
        // ============================================
        // CODE PROMO APPLIQUÉ
        // ============================================
        <Animated.View
          style={[styles.appliedContainer, { transform: [{ scale: animatedValue }] }]}
        >
          <View style={styles.appliedContent}>
            <View style={styles.appliedLeft}>
              <View style={styles.appliedIconContainer}>
                <Percent size={24} color="#FFFFFF" />
              </View>
              <View style={styles.appliedInfo}>
                <Text style={styles.appliedCode}>{appliedPromo.code}</Text>
                <Text style={styles.appliedDiscount}>{formatDiscount(appliedPromo)}</Text>
                <Text style={styles.appliedSaved}>{formatSavedAmount(appliedPromo)}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleRemovePromo}
              style={styles.removeButton}
              activeOpacity={0.7}
            >
              <X size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : (
        // ============================================
        // FORMULAIRE SAISIE CODE PROMO
        // ============================================
        <>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Tag size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, displayError && styles.inputError]}
                placeholder="Entrez votre code promo"
                placeholderTextColor="#9CA3AF"
                value={promoCode}
                onChangeText={handleInputChange}
                autoCapitalize="characters"
                editable={!isLoading}
                maxLength={20}
                returnKeyType="done"
                onSubmitEditing={handleApplyPromoCode}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.applyButton,
                isButtonDisabled && styles.applyButtonDisabled,
              ]}
              onPress={handleApplyPromoCode}
              activeOpacity={0.8}
              disabled={isButtonDisabled}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.applyButtonText}>Appliquer</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Message d'erreur */}
          {displayError && (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color="#DC2626" />
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          )}

          {/* Suggestions */}
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>
              💡 Consultez vos emails pour des codes exclusifs
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default PromoCodeComponent;

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  appliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  appliedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Code promo appliqué
  appliedContainer: {
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 16,
  },
  appliedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appliedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  appliedIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appliedInfo: {
    flex: 1,
  },
  appliedCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 4,
  },
  appliedDiscount: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 2,
  },
  appliedSaved: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.85,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Formulaire
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: 12,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEE2E2',
  },
  applyButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  applyButtonDisabled: {
    backgroundColor: '#D1D5DB',
    opacity: 0.6,
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Erreur
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    flex: 1,
  },

  // Hint
  hintContainer: {
    marginTop: 10,
    paddingHorizontal: 4,
  },
  hintText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});