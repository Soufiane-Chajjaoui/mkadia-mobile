export const getErrorMessage = (url: string, status: number, serverMessage?: string): string => {
  const isLogin = url.includes('login');
  const isRegister = url.includes('register');
  const isForgotPassword = url.includes('forgot-password');
  const isVerifyEmail = url.includes('verify-email');
  const isResetPassword = url.includes('reset-password');

  // 🎯 Erreurs d'authentification (401)
  if (status === 401) {
    if (isLogin) {
      return serverMessage || 'Email ou mot de passe incorrect';
    }
    if (isRegister) {
      return serverMessage || 'Erreur lors de l\'inscription';
    }
    if (isVerifyEmail) {
      return serverMessage || 'Code de vérification invalide';
    }
    if (isResetPassword) {
      return serverMessage || 'Lien de réinitialisation invalide ou expiré';
    }
    return serverMessage || 'Authentification échouée';
  }

  // 🎯 Erreurs de validation (400)
  if (status === 400) {
    if (isRegister) {
      return serverMessage || 'Données d\'inscription invalides. Vérifiez vos informations.';
    }
    if (isLogin) {
      return serverMessage || 'Données de connexion invalides';
    }
    if (isForgotPassword) {
      return serverMessage || 'Email invalide ou introuvable';
    }
    return serverMessage || 'Données invalides';
  }

  // 🎯 Conflit (409) - ex: email déjà utilisé
  if (status === 409) {
    if (isRegister) {
      return serverMessage || 'Cet email est déjà utilisé. Essayez de vous connecter.';
    }
    return serverMessage || 'Cette ressource existe déjà';
  }

  // 🎯 Erreur de format (422)
  if (status === 422) {
    if (isRegister) {
      return serverMessage || 'Format d\'email ou mot de passe invalide';
    }
    return serverMessage || 'Format des données incorrect';
  }

  // 🎯 Trop de tentatives (429)
  if (status === 429) {
    return 'Trop de tentatives. Réessayez dans quelques minutes.';
  }

  // 🎯 Erreurs serveur (500+)
  if (status >= 500) {
    return 'Erreur serveur. Veuillez réessayer plus tard.';
  }

  // 🎯 Autres erreurs
  return serverMessage || 'Une erreur est survenue';
};