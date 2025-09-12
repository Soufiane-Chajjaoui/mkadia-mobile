import { useState } from 'react';
import { ToastData, ToastType } from '../types/ToastType';

export const useToast = () => {
  const [toast, setToast] = useState<ToastData>({
    message: '',
    type: 'info',
    duration: 3000,
  });
  const [visible, setVisible] = useState(false);

  const showToast = (
    message: string, 
    type: ToastType = 'info', 
    duration: number = 3000
  ) => {
    setToast({
      message,
      type,
      duration,
    });
    setVisible(true);
  };

  const hideToast = () => {
    setVisible(false);
  };

  // Fonctions de convenance
  const showSuccess = (message: string, duration?: number) => 
    showToast(message, 'success', duration);

  const showError = (message: string, duration?: number) => 
    showToast(message, 'error', duration);

  const showWarning = (message: string, duration?: number) => 
    showToast(message, 'warning', duration);

  const showInfo = (message: string, duration?: number) => 
    showToast(message, 'info', duration);

  return {
    toast,
    visible,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};