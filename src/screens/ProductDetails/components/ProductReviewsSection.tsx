import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MessageSquare, ChevronDown, MessagesSquare } from 'lucide-react-native';
import { Colors, Spacing, Typography, BorderRadius, IconSize } from '../../../constants/DesignSystem';
import { Review } from '../../../models/Review';
import { useAppSelector } from '../../../hooks/useRedux';
import { navigateToLoginRequired } from '../../../navigation/LoginRequiredNavigation';
import ReviewItem from './ReviewItem';
import AddReviewForm from './AddReviewForm';

interface ProductReviewsSectionProps {
  reviews: Review[];
  totalReviews: number;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  isSubmitting: boolean;
  onLoadMore: () => void;
  onAddReview: (rating: number, comment: string) => void;
  onUpdateReview?: (reviewId: number, rating: number, comment: string) => void;
  onDeleteReview?: (reviewId: number) => void;
}

const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  reviews,
  totalReviews,
  loading,
  loadingMore,
  hasMore,
  isSubmitting,
  onLoadMore,
  onAddReview,
  onDeleteReview,
}) => {
  const [showAddReview, setShowAddReview] = useState(false);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleAddReview = (rating: number, comment: string) => {
    if (!isAuthenticated) {
      navigateToLoginRequired('review');
      return;
    }

    onAddReview(rating, comment);
    setShowAddReview(false);
  };

  const handleToggleAddReview = () => {
    if (!isAuthenticated) {
      navigateToLoginRequired('review');
      return;
    }
    setShowAddReview((prev) => !prev);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      onLoadMore();
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MessageSquare size={IconSize.MD} color={Colors.DARK_BLUE_TEXT} />
          <Text style={styles.title}>Avis clients</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.GREEN_BG} />
          <Text style={styles.loadingText}>Chargement des avis...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <MessagesSquare size={IconSize.MD} color={Colors.DARK_BLUE_TEXT} />
        <Text style={styles.title}>
          Avis clients {totalReviews > 0 && `(${totalReviews})`}
        </Text>
      </View>

      {/* Bouton pour ajouter un avis - Toujours visible */}
      <TouchableOpacity
        style={styles.addReviewButton}
        onPress={handleToggleAddReview}
        activeOpacity={0.7}
      >
        <Text style={styles.addReviewButtonText}>
          {showAddReview ? 'Annuler' : 'Donner mon avis'}
        </Text>
      </TouchableOpacity>

      {/* Formulaire d'ajout d'avis */}
      {showAddReview && (
        <AddReviewForm onSubmit={handleAddReview} isSubmitting={isSubmitting} />
      )}

      {/* Liste des avis */}
      {reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MessagesSquare size={48} color={Colors.GRAY_ICON} />
          <Text style={styles.emptyText}>Aucun avis pour le moment</Text>
          <Text style={styles.emptySubtext}>
            Soyez le premier à donner votre avis sur ce produit
          </Text>
        </View>
      ) : (
        <View style={styles.reviewsList}>
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onDelete={onDeleteReview}
            />
          ))}

          {/* Bouton "Voir plus" */}
          {hasMore && (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={handleLoadMore}
              disabled={loadingMore}
              activeOpacity={0.7}
            >
              {loadingMore ? (
                <ActivityIndicator size="small" color={Colors.GREEN_BG} />
              ) : (
                <>
                  <Text style={styles.loadMoreText}>Voir plus d'avis</Text>
                  <ChevronDown size={IconSize.SM} color={Colors.GREEN_TEXT} />
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.LG,
    backgroundColor: Colors.LIGHT_GRAY_BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.MD,
    gap: Spacing.SM,
  },
  title: {
    ...Typography.SUBHEAD,
    fontSize: 18,
    color: Colors.DARK_BLUE_TEXT,
  },
  addReviewButton: {
    backgroundColor: Colors.GREEN_BG,
    borderRadius: BorderRadius.MD,
    padding: Spacing.MD,
    alignItems: 'center',
    marginBottom: Spacing.MD,
  },
  addReviewButtonText: {
    ...Typography.SUBHEAD,
    color: Colors.WHITE_TEXT,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.XL,
    gap: Spacing.SM,
  },
  loadingText: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: Spacing.XL,
    backgroundColor: Colors.WHITE,
    borderRadius: BorderRadius.MD,
    borderWidth: 1,
    borderColor: Colors.GRAY_ICON,
  },
  emptyText: {
    ...Typography.SUBHEAD,
    color: Colors.DARK_GRAY_TEXT,
    marginTop: Spacing.MD,
    marginBottom: Spacing.XS,
  },
  emptySubtext: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    textAlign: 'center',
  },
  reviewsList: {
    gap: 4,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.MD,
    backgroundColor: Colors.WHITE,
    borderRadius: BorderRadius.MD,
    borderWidth: 1,
    borderColor: Colors.GREEN_BG,
    marginTop: 10,
    gap: Spacing.XS,
  },
  loadMoreText: {
    ...Typography.SUBHEAD,
    color: Colors.GREEN_TEXT,
  },
});

export default ProductReviewsSection;

