import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Package } from 'lucide-react-native';
import { Colors, Spacing, Typography, Elevation, BorderRadius } from '../../../../../constants/DesignSystem';
import { OrderItem } from '../../../../../models/Order';
import PriceText from '../../../../../components/PriceText';
import { replaceBaseUrl } from '../../../../../utils/urlHelper';

interface OrderItemsListProps {
  items: OrderItem[];
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({ items }) => {
  const calculateDiscountedPrice = (item: OrderItem) => {
    const product = item.product;
    if (product.discount > 0) {
      return product.price * (1 - product.discount / 100);
    }
    return product.price;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Package size={20} color={Colors.DARK_BLUE_TEXT} strokeWidth={2.5} />
        <Text style={styles.title}>Articles ({items.length})</Text>
      </View>

      {items.map((item, index) => (
        <View key={item.id} style={[styles.itemCard, index === items.length - 1 && styles.lastItem]}>
          <View style={styles.itemContent}>
            {/* Image du produit */}
            <View style={styles.imageContainer}>
              {item.product.urls && item.product.urls.length > 0 ? (
                <Image source={{ uri: replaceBaseUrl(item.product.urls[0].url) }} style={styles.productImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Package size={24} color={Colors.ORANGE_ICON} />
                </View>
              )}
            </View>

            {/* Informations du produit */}
            <View style={styles.itemInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.product.name}
              </Text>
              
              <View style={styles.quantityRow}>
                <Text style={styles.quantityText}>
                  Quantité: {item.quantity} × {item.product.quantity} {item.product.unit}
                </Text>
              </View>

              {item.product.discount > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{item.product.discount}%</Text>
                </View>
              )}
            </View>

            {/* Prix */}
            <View style={styles.priceContainer}>
              {item.product.discount > 0 ? (
                <>
                  <PriceText 
                    amount={calculateDiscountedPrice(item) * item.quantity} 
                    style={styles.itemPrice}
                    iconSize={14}
                    iconColor={Colors.GREEN_TEXT}
                  />
                  <PriceText 
                    amount={item.product.price * item.quantity} 
                    style={styles.originalPrice}
                    iconSize={12}
                    iconColor={Colors.GRAY_TEXT}
                  />
                </>
              ) : (
                <PriceText 
                  amount={item.price * item.quantity} 
                  style={styles.itemPrice}
                  iconSize={14}
                  iconColor={Colors.GREEN_TEXT}
                />
              )}
            </View>
          </View>
        </View>
      ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.MD,
    gap: Spacing.SM,
  },
  title: {
    ...Typography.HEADLINE,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.DARK_BLUE_TEXT,
  },
  itemCard: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY_BG,
    paddingVertical: Spacing.MD,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemContent: {
    flexDirection: 'row',
    gap: Spacing.MD,
  },
  imageContainer: {
    width: 90,
    height: 80,
    borderRadius: BorderRadius.LG,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.LIGHT_GRAY_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    ...Typography.SUBHEAD,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: Spacing.XS,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    fontSize: 13,
  },
  discountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: Spacing.SM,
    paddingVertical: 2,
    borderRadius: BorderRadius.SM,
    marginTop: Spacing.XS,
  },
  discountText: {
    ...Typography.CAPTION,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.RED,
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  itemPrice: {
    ...Typography.SUBHEAD,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.GREEN_TEXT,
  },
  originalPrice: {
    ...Typography.CAPTION,
    fontSize: 13,
    color: Colors.GRAY_TEXT,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
});

export default OrderItemsList;

