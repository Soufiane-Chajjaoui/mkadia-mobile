// FavoritesScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Animated,
} from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import { Colors, Spacing, Typography, IconSize, BorderRadius, Elevation } from '../../constants/DesignSystem';
import { navigate } from '../../navigation/NavigationService';
import FavoriteItemCard from './components/FavoriteItemCard';
import { useFavorites } from '../../hooks/useFavorites';
import { useCart } from '../../hooks/useCart';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { initializeFavorites } from '../../features/favorites/favoritesSlice';
import { getFavorites$ } from '../../apis/FavoriteAPI';

const FavoritesScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { toggleFavorite, isTogglingFavorite } = useFavorites();
  const { addToCart } = useCart();
  
  // Utiliser Redux pour les favoris
  const favorites = useAppSelector((state) => state.favorites.items);
  const isLoading = useAppSelector((state) => state.favorites.isLoading);
  const [refreshing, setRefreshing] = React.useState(false);
  const [favoritesData, setFavoritesData] = React.useState<any[]>([]);

  useEffect(() => {
    dispatch(initializeFavorites());
    loadFavoritesDetails();
  }, []);

  // Recharger les détails quand la liste change
  useEffect(() => {
    if (favorites.length > 0) {
      loadFavoritesDetails();
    } else {
      setFavoritesData([]);
    }
  }, [favorites.length]);

  const loadFavoritesDetails = () => {
    setRefreshing(true);
    const subscription = getFavorites$().subscribe({
      next: (favoriteItems: any[]) => {
        setFavoritesData(favoriteItems);
        setRefreshing(false);
      },
      error: (err) => {
        console.error('Erreur favoris:', err);
        setRefreshing(false);
      }
    });
    return () => subscription.unsubscribe();
  };

  const handleRefresh = () => {
    dispatch(initializeFavorites());
    loadFavoritesDetails();
  };

  const handleAddToCart = (favorite: any) => {
    addToCart(favorite.product.id, 1);
  };

  const handleToggleFavorite = (productId: number) => {
    toggleFavorite(productId);
  };

  const handleProductPress = (favorite: any) => {
    navigate('ProductDetails', favorite.product);
  };

  const handleStartShopping = () => {
    navigate('MainTabs', { screen: 'HomeTab' });
  };

  const renderEmptyFavorites = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Aucun favori</Text>
      <Text style={styles.emptySubtitle}>
        Découvrez nos produits et ajoutez vos préférés
      </Text>
      <TouchableOpacity
        style={styles.startShoppingButton}
        onPress={handleStartShopping}
        activeOpacity={0.85}
      >
        <Text style={styles.startShoppingText}>Découvrir les produits</Text>
        <ArrowRight size={IconSize.SM} color={Colors.WHITE} />
      </TouchableOpacity>
    </View>
  );

  if (isLoading && favoritesData.length === 0) {
    return (
      <SafeAreaWrapper>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (favoritesData.length === 0) {
    return (
      <SafeAreaWrapper>
        {renderEmptyFavorites()}
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mes Favoris ({favoritesData.length})</Text>
        </View>

        <FlatList
          data={favoritesData}
          renderItem={({ item }) => (
            <FavoriteItemCard
              favorite={item}
              onAddToCart={() => handleAddToCart(item)}
              onPress={() => handleProductPress(item)}
              onRemoveFromFavorites={() => handleToggleFavorite(item.product.id)}
              isTogglingFavorite={isTogglingFavorite(item.product.id)}
            />
          )}
          keyExtractor={(item) => `favorite-${item.id}`}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.GREEN_BG]}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaWrapper>
  );
};

// ... styles identiques

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.SM,
    padding: Spacing.LG,
    ...Elevation.LOW,
    backgroundColor: Colors.WHITE,
    ...Elevation.LOW,
  },
  headerTitle: {
    ...Typography.HEADLINE,
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.DARK_BLUE_TEXT
  },
  listContent: {
    paddingVertical: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.MD,
    padding: Spacing.XXL,
  },
  emptyTitle: {
    ...Typography.HEADLINE,
    color: Colors.DARK_BLUE_TEXT,
  },
  emptySubtitle: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    textAlign: 'center',
  },
  startShoppingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.SM,
    backgroundColor: Colors.GREEN_BG,
    paddingHorizontal: Spacing.XL,
    paddingVertical: Spacing.MD,
    borderRadius: BorderRadius.MD,
    ...Elevation.LOW,
  },
  startShoppingText: {
    ...Typography.SUBHEAD,
    color: Colors.WHITE,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE,
  },
  loadingText: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
  },
});

export default FavoritesScreen;
