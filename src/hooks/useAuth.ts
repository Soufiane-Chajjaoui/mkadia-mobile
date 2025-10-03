// src/hooks/useAuth.ts
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TokenType } from "../enums/TokenType";

type JwtPayload = {
  sub: string;
  roles: string[];  // dépend de ton backend Spring Security
  exp: number;
};

export default function useAuth() {
  const [roles, setRoles] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem(TokenType.ACCESS_TOKEN);
      if (storedToken) {
        setToken(storedToken);
        const decoded = jwtDecode<JwtPayload>(storedToken);
        setRoles(decoded.roles || []);
        console.log("rôles:", decoded.roles);
      }
    };
    loadToken();
  }, []);

  const isAuthenticated = !!token;

  return { token, roles, isAuthenticated };
}
