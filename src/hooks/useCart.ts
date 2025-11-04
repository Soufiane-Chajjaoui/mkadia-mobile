import { useState, useCallback } from 'react';
import { addItemToCart$, CartItemRequest } from '../apis/CartAPI';
import { showGlobalSuccess, showGlobalError } from '../context/ToastContext';
import { useAppSelector, useAppDispatch } from './useRedux';
import { navigateToLoginRequired } from '../navigation/LoginRequiredNavigation';
import { addItemAsync } from '../features/cart/cartSlice';

export const useCart = () => {
  const [addingToCart, setAddingToCart] = useState<{[key: number]: boolean}>({});
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();

  const addToCart = useCallback((productId: number, quantity: number = 1) => {
    // Vérifier l'authentification avant toute action
    if (!isAuthenticated) {
      navigateToLoginRequired('cart'); // ✅ Affiche l'écran avec les icônes de panier
      return false; // Retourner false pour indiquer que l'action n'a pas été effectuée
    }

    if (addingToCart[productId]) return false;

    setAddingToCart(prev => ({ ...prev, [productId]: true }));

    const cartItem: CartItemRequest = {
      productId,
      quantity
    };

    addItemToCart$(cartItem).subscribe({
      next: () => {
        // Mettre à jour le Redux store
        dispatch(addItemAsync({
          id: productId,
          productId: productId,
          quantity: quantity
        }));
        showGlobalSuccess("Produit ajouté au panier");
        setAddingToCart(prev => ({ ...prev, [productId]: false }));
      },
      error: (err) => {
        console.error("Erreur ajout panier:", err);
        showGlobalError("Erreur lors de l'ajout au panier");
        setAddingToCart(prev => ({ ...prev, [productId]: false }));
      }
    });

    return true; // Retourner true pour indiquer que l'action a été effectuée
  }, [addingToCart, isAuthenticated, dispatch]);

  return {
    addToCart,
    addingToCart,
  };
};

