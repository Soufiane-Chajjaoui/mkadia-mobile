// contexts/ToastContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { ToastData, ToastType } from '../types/ToastType';

interface ToastContextType {
  toast: ToastData;
  visible: boolean;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ✅ Variable globale pour accéder au toast en dehors des composants
let globalShowToast: ((message: string, type?: ToastType, duration?: number) => void) | null = null;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    setToast({ message, type, duration });
    setVisible(true);
  };

  // ✅ Enregistrer la fonction globalement
  React.useEffect(() => {
    globalShowToast = showToast;
    return () => {
      globalShowToast = null;
    };
  }, []);

  const hideToast = () => {
    setVisible(false);
  };

  const showSuccess = (message: string, duration?: number) =>
    showToast(message, 'success', duration);

  const showError = (message: string, duration?: number) =>
    showToast(message, 'error', duration);

  const showWarning = (message: string, duration?: number) =>
    showToast(message, 'warning', duration);

  const showInfo = (message: string, duration?: number) =>
    showToast(message, 'info', duration);

  return (
    <ToastContext.Provider
      value={{
        toast,
        visible,
        showToast,
        hideToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// ✅ Fonction helper pour utiliser le toast en dehors des composants
export const showGlobalToast = (
  message: string,
  type: ToastType = 'info',
  duration: number = 3000
) => {
  if (globalShowToast) {
    globalShowToast(message, type, duration);
  } else {
    console.warn('Toast not initialized yet');
  }
};

export const showGlobalError = (message: string, duration?: number) =>
  showGlobalToast(message, 'error', duration);

export const showGlobalSuccess = (message: string, duration?: number) =>
  showGlobalToast(message, 'success', duration);

export const showGlobalWarning = (message: string, duration?: number) =>
  showGlobalToast(message, 'warning', duration);

export const showGlobalInfo = (message: string, duration?: number) =>
  showGlobalToast(message, 'info', duration);