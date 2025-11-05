import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Star, User, Trash2 } from 'lucide-react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../../constants/DesignSystem';
import { Review } from '../../../models/Review';
import { useAppSelector } from '../../../hooks/useRedux';
import { JwtService } from '../../../services/JwtService';

interface ReviewItemProps {
  review: Review;
  onDelete?: (reviewId: number) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onDelete }) => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [isDeleting, setIsDeleting] = useState(false);

  // Vérification de sécurité
  if (!review) {
    console.warn('ReviewItem: review is undefined');
    return null;
  }

  // Vérifier si c'est l'avis de l'utilisateur connecté
  const isOwnReview = () => {
    // Priorité 1: Comparer par ID utilisateur (ne change jamais)
    const currentUserId = JwtService.getUserId(accessToken);
    return currentUserId === review.user.id;
  };

  // Gérer la suppression
  const handleDelete = () => {
    Alert.alert(
      'Supprimer l\'avis',
      'Êtes-vous sûr de vouloir supprimer cet avis ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            if (onDelete) {
              setIsDeleting(true);
              onDelete(review.id!);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInDays === 0) return "Aujourd'hui";
    if (diffInDays === 1) return "Hier";
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
    if (diffInDays < 365) return `Il y a ${Math.floor(diffInDays / 30)} mois`;
    return `Il y a ${Math.floor(diffInDays / 365)} ans`;
  };

  const getUserDisplayName = () => {
    // Vérifier si l'utilisateur existe
    if (!review.user) {
      return 'Utilisateur inconnu';
    }

    // Si c'est l'avis de l'utilisateur connecté, afficher "Vous"
    // Priorité 1: Comparer par ID utilisateur
    const currentUserId = JwtService.getUserId(accessToken);
    if (currentUserId && review.user.id && currentUserId === review.user.id) {
      return 'Vous';
    }

    // Fallback: Comparer par email
    const currentUserEmail = JwtService.getUserEmail(accessToken);
    if (currentUserEmail && review.user.email && currentUserEmail === review.user.email) {
      return 'Vous';
    }

    const { firstName, lastName } = review.user;

    // Vérifier si firstName et lastName existent
    if (!firstName && !lastName) {
      return 'Utilisateur inconnu';
    }

    return `${firstName || ''} ${lastName || ''}`.trim();
  };

  return (
    <View style={[styles.container, isDeleting && styles.containerDeleting]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <User size={20} color={Colors.WHITE_ICON} />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{getUserDisplayName()}</Text>
            <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                color={star <= review.rating ? Colors.ORANGE_ICON : Colors.GRAY_ICON}
                fill={star <= review.rating ? Colors.ORANGE_ICON : 'transparent'}
              />
            ))}
          </View>

          {/* Bouton de suppression - visible uniquement pour l'utilisateur connecté */}
          {isOwnReview() && onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={isDeleting}
              activeOpacity={0.7}
            >
              <Trash2
                size={18}
                color={isDeleting ? Colors.GRAY_ICON : Colors.GRAY_TEXT}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    padding: Spacing.MD,
    borderRadius: BorderRadius.SM,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.GREEN_BG,
  },
  containerDeleting: {
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.SM,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.GREEN_BG,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.SM,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    ...Typography.SUBHEAD,
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: 2,
  },
  date: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.SM,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  deleteButton: {
    padding: Spacing.XS,
    borderRadius: BorderRadius.SM,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GRAY_ICON,
  },
  comment: {
    ...Typography.BODY,
    color: Colors.DARK_GRAY_TEXT,
    lineHeight: 20,
  },
});

export default ReviewItem;

