import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Animated,
} from 'react-native';
import { Heart, ArrowRight } from 'lucide-react-native';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import { Colors, Spacing, Typography, IconSize, BorderRadius, Elevation } from '../../constants/DesignSystem';
import { getFavorites$ } from '../../apis/FavoriteAPI';
import { showGlobalError } from '../../context/ToastContext';
import { navigate } from '../../navigation/NavigationService';
import FavoriteItemCard from './components/FavoriteItemCard';
import { useFavorites } from '../../hooks/useFavorites';
import { useCart } from '../../hooks/useCart';
import { Favorite } from '../../models/Favorite';

const FavoritesScreen: React.FC = () => {
  const { toggleFavorite, togglingFavorites } = useFavorites();
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    loadFavoritesData();
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  const loadFavoritesData = useCallback(() => {
    setLoading(true);
    const subscription = getFavorites$().subscribe({
      next: (favoriteItems: Favorite[]) => {
        console.log("Favoris reçus:", favoriteItems);
        setFavorites(favoriteItems);
        setLoading(false);
        setRefreshing(false);
      },
      error: (err) => {
        console.error('Erreur favoris:', err);
        showGlobalError("Erreur lors du chargement des favoris");
        setLoading(false);
        setRefreshing(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadFavoritesData();
  }, [loadFavoritesData]);

  const handleAddToCart = (favorite: Favorite) => {
    addToCart(favorite.product.id, 1);
  };

  const handleToggleFavorite = (productId: number, currentState: boolean) => {
    toggleFavorite(productId, currentState);
    if (currentState) {
      // Retirer le favori de la liste après suppression
      setFavorites(prev => prev.filter(item => item.product.id !== productId));
    }
  };

  const handleProductPress = (favorite: Favorite) => {
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

  if (loading) {
    return (
      <SafeAreaWrapper>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (favorites.length === 0) {
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
          <Text style={styles.headerTitle}>Mes Favoris ({favorites.length})</Text>
        </View>

        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <Animated.View style={{ opacity: fadeAnim }}>
              <FavoriteItemCard
                favorite={item}
                onAddToCart={() => handleAddToCart(item)}
                onPress={() => handleProductPress(item)}
                onRemoveFromFavorites={() => handleToggleFavorite(item.product.id, true)}
                isTogglingFavorite={togglingFavorites[item.product.id] || false}
              />
            </Animated.View>
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
