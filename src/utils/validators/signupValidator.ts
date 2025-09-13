import { validateEmail } from "./emailValidator";
import { validatePhone } from "./phoneValidator";
import { validatePassword } from "./passwordValidator";
import { SignupFormData } from "../../screens/auth/SignUp/SignUpScreen";

export interface SignupErrors {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: string;
}

export const validateSignupFields = (
  formData: SignupFormData,
  acceptTerms: boolean
): { isValid: boolean; errors: SignupErrors } => {
  let isValid = true;

  const errors: SignupErrors = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: "",
  };

  // Prénom
  if (!formData.firstName.trim()) {
    errors.firstName = "Le prénom est requis";
    isValid = false;
  }

  // Nom
  if (!formData.lastName.trim()) {
    errors.lastName = "Le nom est requis";
    isValid = false;
  }

  // Email
  if (!formData.email.trim()) {
    errors.email = "L'email est requis";
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    errors.email = "Format d'email invalide";
    isValid = false;
  }

  // Téléphone
  if (!formData.phone.trim()) {
    errors.phone = "Le téléphone est requis";
    isValid = false;
  } else if (!validatePhone(formData.phone)) {
    errors.phone = "Format de téléphone invalide (10 chiffres)";
    isValid = false;
  }

  // Mot de passe
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message || "Mot de passe faible";
    isValid = false;
  }

  // Confirmation
  if (!formData.confirmPassword) {
    errors.confirmPassword = "Confirmez votre mot de passe";
    isValid = false;
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas";
    isValid = false;
  }

  // Termes
  if (!acceptTerms) {
    errors.terms = "Vous devez accepter les termes et conditions";
    isValid = false;
  }

  return { isValid, errors };
};
