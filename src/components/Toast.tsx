// components/Toast.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { ToastData } from '../types/ToastType';

interface ToastProps {
  toast: ToastData;
  visible: boolean;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, visible, onHide }) => {
  const translateY = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 65,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.delay(toast.duration || 3000),
        Animated.timing(translateY, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible, toast.duration, translateY, onHide]);

  if (!visible) return null;

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return { borderColor: '#10B981', icon: '✔', iconBg: '#D1FAE5' };
      case 'error':
        return { borderColor: '#EF4444', icon: '✕', iconBg: '#FEE2E2' };
      case 'warning':
        return { borderColor: '#F59E0B', icon: '⚡', iconBg: '#FEF3C7' };
      case 'info':
      default:
        return { borderColor: '#3B82F6', icon: 'ⓘ', iconBg: '#DBEAFE' };
    }
  };

  const { borderColor, icon, iconBg } = getStyles();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderLeftColor: borderColor,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.message} numberOfLines={3}>
        {toast.message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // ✅ Fond blanc
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderLeftWidth: 4, // ✅ Bordure colorée à gauche
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 9999,
    minHeight: 56,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 16,
  },
  message: {
    flex: 1,
    color: '#1F2937', // ✅ Texte foncé
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});