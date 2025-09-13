export interface PasswordValidationResult {
  isValid: boolean;
  message: string;
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
    message:
      password.length < minLength
        ? "Au moins 8 caractères requis"
        : !hasUpperCase || !hasLowerCase
        ? "Majuscule et minuscule requises"
        : !hasNumbers
        ? "Au moins un chiffre requis"
        : "",
  };
};
