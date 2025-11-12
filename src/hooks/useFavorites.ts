// useFavorites.ts - Version Redux
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { 
  toggleFavoriteAsync, 
  selectFavoritesIsLoading,
  selectIsFavorite 
} from '../features/favorites/favoritesSlice';
import { showGlobalInfo, showGlobalError, showGlobalSuccess } from '../context/ToastContext';
import { navigateToLoginRequired } from '../navigation/LoginRequiredNavigation';

export const useFavorites = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector(selectFavoritesIsLoading);
  const favorites = useAppSelector((state) => state.favorites.items);

  // Toggle basé sur productId (comme ProductCard)
  const toggleFavorite = useCallback(async (productId: number, onSuccess?: () => void) => {
    if (!isAuthenticated) {
      navigateToLoginRequired('favorites');
      return false;
    }

    if (isLoading) return false;

    // Trouver le favori existant par productId
    const existingFavorite = favorites.find(fav => fav.productId === productId);
    const currentState = !!existingFavorite;

    try {
      // Dispatch l'action Redux
      await dispatch(toggleFavoriteAsync({ 
        id: existingFavorite?.id || 0, 
        productId 
      })).unwrap();

      // Afficher le bon message
      if (currentState) {
        showGlobalInfo("Produit retiré des favoris");
      } else {
        showGlobalSuccess("Produit ajouté aux favoris");
      }

      onSuccess?.();
      return true;
    } catch (err) {
      console.error("Erreur toggle favoris:", err);
      showGlobalError("Erreur lors de la modification des favoris");
      return false;
    }
  }, [dispatch, isAuthenticated, isLoading, favorites]);

  // Vérifier si un produit est favori
  const isFavorite = useCallback((productId: number) => {
    return favorites.some(fav => fav.productId === productId);
  }, [favorites]);

  // État de chargement pour un produit spécifique
  const isTogglingFavorite = useCallback((productId: number) => {
    return isLoading;
  }, [isLoading]);

  return {
    toggleFavorite,
    isFavorite,
    isTogglingFavorite,
    favorites,
  };
};