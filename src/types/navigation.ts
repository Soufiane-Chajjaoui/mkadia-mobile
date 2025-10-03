import { CategoryCard } from "../models/CategoryCard";
import { ProductCard } from "../models/ProductCard";
import { LoginRequiredScreenProps } from "../screens/auth/LoginRequired/LoginRequiredScreen";

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  CategoryProducts: CategoryCard;
  ProductDetails: ProductCard;
  Login: undefined
  SignUp: undefined
  ResetPassword: undefined,
  ChangePassword: {token? : string, email? : string},
  Cart: undefined
  LoginRequired: LoginRequiredScreenProps
};