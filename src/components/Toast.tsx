import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { ToastData } from '../types/ToastType';
import { Elevation } from '../constants/DesignSystem';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react-native';

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
      ]).start(onHide);
    }
  }, [visible, toast.duration, translateY, onHide]);

  if (!visible) return null;

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return { borderColor: '#10B981', bg: '#D1FAE5', Icon: CheckCircle, color: '#10B981' };
      case 'error':
        return { borderColor: '#EF4444', bg: '#FEE2E2', Icon: XCircle, color: '#EF4444' };
      case 'warning':
        return { borderColor: '#F59E0B', bg: '#FEF3C7', Icon: AlertTriangle, color: '#F59E0B' };
      case 'info':
      default:
        return { borderColor: '#3B82F6', bg: '#DBEAFE', Icon: Info, color: '#3B82F6' };
    }
  };

  const { borderColor, bg, Icon, color } = getStyles();

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
      <View style={[styles.iconContainer, { backgroundColor: bg }]}>
        <Icon color={color} size={20} />
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
    bottom: 80,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: Elevation.LOW.elevation,
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
  message: {
    flex: 1,
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});
