import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Share,
  ActivityIndicator,
  Text,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { Colors, Spacing, Typography } from "../../constants/DesignSystem";
import ProductBottomActions from "./components/ProductBottomActions";
import ProductDetailedInfo from "./components/ProductDetailedInfo";
import ProductDetailHeader from "./components/ProductDetailHeader";
import ProductImageGallery from "./components/ProductImageGallery";
import ProductInfoSection from "./components/ProductInfoSection";
import { getProductById$ } from "../../apis/PublicAPI";
import { ProductCard } from "../../models/ProductCard";
import { ProductDetails } from "../../models/ProductDetails";
import { useAppDispatch } from "../../hooks/useStateApp";
import { addItem } from "../../features/cart/cartSlice";


type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const routeProduct: ProductCard = route.params;
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const dispatch = useAppDispatch();
  

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const subGetProductsById = getProductById$(routeProduct).subscribe({
      next: (data: ProductDetails) => {
        setProduct(data);
        setLoading(false);
      },
      error: (err) => {
        console.error(err);
        setError("Erreur lors du chargement du produit");
        setLoading(false);
        // En cas d'erreur, utiliser les données de route.params
        setProduct(routeProduct as ProductDetails);
      },
    });

    return () => subGetProductsById.unsubscribe();
  }, [routeProduct.id]);

  // Handlers
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleShare = async () => {
    if (!product) return;
    
    try {
      await Share.share({
        message: `Découvrez ${product.name} - ${product.price} DH`,
        title: product.name,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(prev => !prev);
  };

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleIncrementQuantity = () => {
    setCartQuantity(prev => prev + 1);
  };

  const handleDecrementQuantity = () => {
    if (cartQuantity > 1) {
      setCartQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addItem(
        {id : product.id, name : product.name, price: product.price, quantity: cartQuantity}
      )
    );
  };

  // État de chargement
  if (loading) {
    return (
      <View style={styles.container}>
        <ProductDetailHeader
          isFavorite={isFavorite}
          onBackPress={handleBackPress}
          onShare={handleShare}
          onToggleFavorite={handleToggleFavorite}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.GREEN_BG} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    );
  }

  // État d'erreur ou produit non trouvé
  if (!product) {
    return (
      <View style={styles.container}>
        <ProductDetailHeader
          isFavorite={isFavorite}
          onBackPress={handleBackPress}
          onShare={handleShare}
          onToggleFavorite={handleToggleFavorite}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || "Produit non trouvé"}
          </Text>
        </View>
      </View>
    );
  }

  // Images du produit
  const productImages = product.urls && product.urls.length > 0 
    ? product.urls 
    : [{ 
        url: "https://via.placeholder.com/400x400/4CAF50/FFFFFF?text=" + 
             encodeURIComponent(product.name.substring(0, 20)) 
      }];

  return (
    <View style={styles.container}>
      <ProductDetailHeader
        isFavorite={isFavorite}
        onBackPress={handleBackPress}
        onShare={handleShare}
        onToggleFavorite={handleToggleFavorite}
      />

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ProductImageGallery
          images={productImages}
          selectedImageIndex={selectedImageIndex}
          productName={product.name}
          isNew={product.newProduct}
          isFeatured={product.featured}
          discount={product.discountPercentage || product.discount} // Prendre en compte les deux champs
          onImageSelect={handleImageSelect}
        />

        <ProductInfoSection
          name={product.name}
          price={product.price}
          discount={product.discountPercentage || product.discount} // Prendre en compte les deux champs
          unit={product.unit}
          description={product.description}
        />

        <ProductDetailedInfo
          brand={product.brand}
          origin={product.origin}
          quantity={product.quantity}
          unit={product.unit}
          expirationDate={product.expirationDate}
          stock={product.stock}
          sku={product.sku}
        />
      </ScrollView>

      <ProductBottomActions
        cartQuantity={cartQuantity}
        price={product.price}
        discount={product.discountPercentage || product.discount} // Prendre en compte les deux champs
        onIncrementQuantity={handleIncrementQuantity}
        onDecrementQuantity={handleDecrementQuantity}
        onAddToCart={handleAddToCart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.XL,
  },
  loadingText: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    marginTop: Spacing.MD,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.XL,
  },
  errorText: {
    ...Typography.BODY,
    color: Colors.RED_ICON,
    textAlign: 'center',
  },
});

export default ProductDetailsScreen;