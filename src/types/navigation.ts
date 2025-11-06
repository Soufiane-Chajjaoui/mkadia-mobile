import { CartItem } from "../models/CartItem";
import { CategoryCard } from "../models/CategoryCard";
import { ProductCard } from "../models/ProductCard";
import { LoginRequiredScreenProps } from "../screens/auth/LoginRequired/LoginRequiredScreen";

export type BottomTabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
  SearchTab: undefined;
  FavoritesTab: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Cart: undefined;
  Onboarding: undefined;
  CategoryProducts: CategoryCard;
  ProductDetails: ProductCard;
  Login: undefined;
  Home: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
  ChangePassword: {token? : string, email? : string};
  LoginRequired: LoginRequiredScreenProps;
  Checkout: { subtotal: number, items: CartItem[] };
  AccountInfo: undefined;
};
