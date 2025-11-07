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
import ProductReviewsSection from "./components/ProductReviewsSection";
import { getProductById$ } from "../../apis/PublicAPI";
import { getReviews$, addReview$, deleteReview$ } from "../../apis/ReviewAPI";
import { ProductCard } from "../../models/ProductCard";
import { ProductDetails } from "../../models/ProductDetails";
import { Review } from "../../models/Review";
import { JwtService } from "../../services/JwtService";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { addItemAsync } from "../../features/cart/cartSlice";
import { showGlobalSuccess, showGlobalError } from "../../context/ToastContext";


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
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  // États pour les avis
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsLoadingMore, setReviewsLoadingMore] = useState(false);
  const [reviewsSubmitting, setReviewsSubmitting] = useState(false);
  const [currentReviewPage, setCurrentReviewPage] = useState(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  

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

  // Charger les avis initiaux
  useEffect(() => {
    if (!product) return;

    loadReviews(0);
  }, [product?.id]);

  // Fonction pour charger les avis
  const loadReviews = (page: number) => {
    if (!product) return;

    const isInitialLoad = page === 0;

    if (isInitialLoad) {
      setReviewsLoading(true);
    } else {
      setReviewsLoadingMore(true);
    }

    getReviews$(product.id, page, 5).subscribe({
      next: (response) => {
        if (isInitialLoad) {
          setReviews(response.elements);
        } else {
          setReviews((prev) => [...prev, ...response.elements]);
        }
        setHasMoreReviews(response.hasMore ?? false);
        setTotalReviews(response.totalRecords ?? 0);
        setCurrentReviewPage(page);
        setReviewsLoading(false);
        setReviewsLoadingMore(false);
      },
      error: (err) => {
        console.error('Erreur chargement avis:', err);
        showGlobalError('Erreur lors du chargement des avis');
        setReviewsLoading(false);
        setReviewsLoadingMore(false);
      },
    });
  };

  // Fonction pour charger plus d'avis
  const handleLoadMoreReviews = () => {
    if (!reviewsLoadingMore && hasMoreReviews) {
      loadReviews(currentReviewPage + 1);
    }
  };

  // Fonction pour calculer la moyenne des avis
  const calculateAverageRating = (): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  // Fonction pour ajouter un avis
  const handleAddReview = (rating: number, comment: string) => {
    if (!product) return;

    setReviewsSubmitting(true);

    addReview$({
      productId: product.id,
      rating,
      comment,
    }).subscribe({
      next: (newReview) => {
        // Enrichir le nouvel avis avec les informations du JWT si elles manquent
        const enrichedReview: Review = {
          ...newReview,
          user: newReview.user || {
            id: JwtService.getUserId(accessToken) || 0, // ID du JWT ou 0 par défaut
            firstName: JwtService.getFirstName(accessToken) || '',
            lastName: JwtService.getLastName(accessToken) || '',
            email: JwtService.getUserEmail(accessToken) || undefined,
          }
        };

        // Si l'API a retourné un user mais sans certaines informations, les enrichir
        if (newReview.user) {
          enrichedReview.user = {
            ...newReview.user,
            id: newReview.user.id || JwtService.getUserId(accessToken) || 0,
            firstName: newReview.user.firstName || JwtService.getFirstName(accessToken) || '',
            lastName: newReview.user.lastName || JwtService.getLastName(accessToken) || '',
          };
        }

        showGlobalSuccess('Votre avis a été publié avec succès');
        setReviews((prev) => [enrichedReview, ...prev]);
        setTotalReviews((prev) => prev + 1);
        setReviewsSubmitting(false);
      },
      error: (err) => {
        console.error('Erreur ajout avis:', err);
        showGlobalError("Erreur lors de l'ajout de votre avis");
        setReviewsSubmitting(false);
      },
    });
  };

  // Fonction pour supprimer un avis
  const handleDeleteReview = (reviewId: number) => {
    deleteReview$(reviewId).subscribe({
      next: () => {
        showGlobalSuccess('Votre avis a été supprimé');
        // Retirer l'avis de la liste
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        setTotalReviews((prev) => prev - 1);
      },
      error: (err) => {
        console.error('Erreur suppression avis:', err);
        showGlobalError("Erreur lors de la suppression de l'avis");
      },
    });
  };

  // Handlers
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleShare = async () => {
    if (!product) return;

    try {
      await Share.share({
        message: `Découvrez ${product.name} - ${product.price}€`,
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
      addItemAsync(
        {id : product.id, productId: product.id, quantity: cartQuantity}
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
          averageRating={calculateAverageRating()}
          totalReviews={totalReviews}
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

        {/* Section des avis clients */}
        <ProductReviewsSection
          reviews={reviews}
          totalReviews={totalReviews}
          loading={reviewsLoading}
          loadingMore={reviewsLoadingMore}
          hasMore={hasMoreReviews}
          isSubmitting={reviewsSubmitting}
          onLoadMore={handleLoadMoreReviews}
          onAddReview={handleAddReview}
          onDeleteReview={handleDeleteReview}
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