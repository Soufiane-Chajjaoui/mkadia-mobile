import { CategoryCard } from "../models/CategoryCard";
import { ProductCard } from "../models/ProductCard";

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  CategoryProducts: CategoryCard;
  ProductDetails: ProductCard;
  Login: undefined
  SignUp: undefined
};