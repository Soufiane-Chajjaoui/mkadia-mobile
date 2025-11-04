import { useState, useCallback } from 'react';
import { addToFavorites$, removeFromFavorites$ } from '../apis/FavoriteAPI';
import { showGlobalInfo, showGlobalError, showGlobalSuccess } from '../context/ToastContext';
import { useAppSelector } from './useRedux';
import { navigateToLoginRequired } from '../navigation/LoginRequiredNavigation';

export const useFavorites = () => {
  const [togglingFavorites, setTogglingFavorites] = useState<{[key: number]: boolean}>({});
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const toggleFavorite = useCallback((productId: number, currentState: boolean) => {
    // Vérifier l'authentification avant toute action
    if (!isAuthenticated) {
      navigateToLoginRequired('favorites'); // ✅ Affiche l'écran avec les icônes de favoris
      return false; // Retourner false pour indiquer que l'action n'a pas été effectuée
    }

    if (togglingFavorites[productId]) return false;

    setTogglingFavorites(prev => ({ ...prev, [productId]: true }));
    const newFavoriteState = !currentState;

    if (newFavoriteState) {
      // Ajouter aux favoris
      addToFavorites$(productId).subscribe({
        next: () => {
          showGlobalSuccess("Produit ajouté aux favoris");
          setTogglingFavorites(prev => ({ ...prev, [productId]: false }));
        },
        error: (err) => {
          console.error("Erreur ajout favoris:", err);
          showGlobalError("Erreur lors de l'ajout aux favoris");
          setTogglingFavorites(prev => ({ ...prev, [productId]: false }));
        }
      });
    } else {
      // Retirer des favoris
      removeFromFavorites$(productId).subscribe({
        next: () => {
          showGlobalInfo("Produit retiré des favoris");
          setTogglingFavorites(prev => ({ ...prev, [productId]: false }));
        },
        error: (err) => {
          console.error("Erreur suppression favoris:", err);
          showGlobalError("Erreur lors de la suppression des favoris");
          setTogglingFavorites(prev => ({ ...prev, [productId]: false }));
        }
      });
    }

    return true; // Retourner true pour indiquer que l'action a été effectuée
  }, [togglingFavorites, isAuthenticated]);

  return {
    toggleFavorite,
    togglingFavorites,
  };
};
