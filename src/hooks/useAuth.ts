// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TokenType } from "../enums/TokenType";
import { JwtService } from "../services/JwtService";

export default function useAuth() {
  const [roles, setRoles] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem(TokenType.ACCESS_TOKEN);
      if (storedToken) {
        setToken(storedToken);

        // Utiliser JwtService pour extraire les informations
        const extractedRoles = JwtService.getRoles(storedToken);
        const extractedUserId = JwtService.getUserId(storedToken);

        setRoles(extractedRoles);
        setUserId(extractedUserId);

        console.log("rôles:", extractedRoles);
        console.log("userId:", extractedUserId);
      }
    };
    loadToken();
  }, []);

  const isAuthenticated = !!token;

  return { token, roles, userId, isAuthenticated };
}
