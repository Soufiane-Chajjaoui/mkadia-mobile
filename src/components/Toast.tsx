import React, { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  View,
} from 'react-native';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react-native';
import { Spacing, BorderRadius, Elevation, Typography } from '../constants/DesignSystem';
import { ToastData } from '../types/ToastType';

interface ToastProps {
  toast: ToastData;
  visible: boolean;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  toast,
  visible, 
  onHide 
}) => {
  const [slideAnim] = useState(new Animated.Value(-100));
  
  // ✅ Déstructuration avec valeurs par défaut
  const { 
    message = '', 
    type = 'info', 
    duration = 3000 
  } = toast || {};

  useEffect(() => {
    if (visible && message) { // ✅ Vérification que message existe
      // Slide down animation
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        // Stay visible for duration
        Animated.delay(duration),
        // Slide up animation
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible, slideAnim, onHide, duration, message]);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#10B981',
          icon: <CheckCircle size={20} color="white" />,
        };
      case 'error':
        return {
          backgroundColor: '#EF4444',
          icon: <AlertCircle size={20} color="white" />,
        };
      case 'warning':
        return {
          backgroundColor: '#F59E0B',
          icon: <AlertTriangle size={20} color="white" />,
        };
      case 'info':
      default:
        return {
          backgroundColor: '#3B82F6',
          icon: <Info size={20} color="white" />,
        };
    }
  };

  // ✅ Ne pas afficher si pas visible ou pas de message
  if (!visible || !message) return null;

  const { backgroundColor, icon } = getToastConfig();

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        { backgroundColor, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {icon}
      <Text style={styles.toastText} numberOfLines={2}>
        {message}
      </Text>
      <TouchableOpacity onPress={onHide} style={styles.closeButton}>
        <X size={18} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: Spacing.MD,
    right: Spacing.MD,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    borderRadius: BorderRadius.MD,
    zIndex: 9999,
    ...Elevation.HIGH,
  },
  toastText: {
    flex: 1,
    color: 'white',
    fontSize: Typography.BODY.fontSize,
    fontWeight: '500',
    marginLeft: Spacing.SM,
    marginRight: Spacing.SM,
  },
  closeButton: {
    padding: Spacing.XS,
  },
});