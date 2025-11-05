import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Star, Send } from 'lucide-react-native';
import { Colors, Spacing, Typography, BorderRadius, IconSize } from '../../../constants/DesignSystem';

interface AddReviewFormProps {
  onSubmit: (rating: number, comment: string) => void;
  isSubmitting: boolean;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({ onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      return; // Ne pas soumettre si aucune note n'est sélectionnée
    }
    if (comment.trim().length === 0) {
      return; // Ne pas soumettre si le commentaire est vide
    }
    onSubmit(rating, comment);
  };

  const canSubmit = rating > 0 && comment.trim().length > 0 && !isSubmitting;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donnez votre avis</Text>

      {/* Sélection de la note */}
      <View style={styles.ratingSection}>
        <Text style={styles.label}>Votre note</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              activeOpacity={0.7}
              style={styles.starButton}
            >
              <Star
                size={32}
                color={star <= rating ? Colors.ORANGE_ICON : Colors.GRAY_ICON}
                fill={star <= rating ? Colors.ORANGE_ICON : 'transparent'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Champ de commentaire */}
      <View style={styles.commentSection}>
        <Text style={styles.label}>Votre commentaire</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Partagez votre expérience avec ce produit..."
          placeholderTextColor={Colors.GRAY_TEXT}
          multiline
          numberOfLines={4}
          value={comment}
          onChangeText={setComment}
          textAlignVertical="top"
          maxLength={500}
        />
        <Text style={styles.characterCount}>{comment.length}/500</Text>
      </View>

      {/* Bouton de soumission */}
      <TouchableOpacity
        style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit}
        activeOpacity={0.8}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color={Colors.WHITE_ICON} />
        ) : (
          <>
            <Send size={IconSize.SM} color={Colors.WHITE_ICON} />
            <Text style={styles.submitButtonText}>Publier mon avis</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    padding: Spacing.LG,
    borderRadius: BorderRadius.MD,
    marginBottom: Spacing.LG,
    borderWidth: 1,
    borderColor: Colors.GRAY_ICON,
  },
  title: {
    ...Typography.SUBHEAD,
    fontSize: 18,
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: Spacing.MD,
  },
  ratingSection: {
    marginBottom: Spacing.LG,
  },
  label: {
    ...Typography.SUBHEAD,
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: Spacing.SM,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: Spacing.SM,
  },
  starButton: {
    padding: Spacing.XS,
  },
  commentSection: {
    marginBottom: Spacing.LG,
  },
  textInput: {
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: BorderRadius.SM,
    padding: Spacing.MD,
    ...Typography.BODY,
    color: Colors.DARK_BLUE_TEXT,
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.GRAY_ICON,
  },
  characterCount: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    textAlign: 'right',
    marginTop: Spacing.XS,
  },
  submitButton: {
    backgroundColor: Colors.GREEN_BG,
    borderRadius: BorderRadius.MD,
    padding: Spacing.MD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.SM,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.GRAY_ICON,
    opacity: 0.6,
  },
  submitButtonText: {
    ...Typography.SUBHEAD,
    color: Colors.WHITE_TEXT,
  },
});

export default AddReviewForm;

