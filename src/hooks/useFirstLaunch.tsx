import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useFirstLaunch() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkFirstLaunch() {
      try {
        const value = await AsyncStorage.getItem("alreadyLaunched");
        
        if (value === null) {
          // Premier lancement - l'app n'a jamais été ouverte
          setIsFirstLaunch(true);
        } else {
          // Pas le premier lancement - l'app a déjà été ouverte
          setIsFirstLaunch(false);
        }
      } catch (e) {
        console.error("Error checking first launch:", e);
        // En cas d'erreur, on considère que c'est le premier lancement
        setIsFirstLaunch(true);
      } finally {
        setLoading(false);
      }
    }
    
    checkFirstLaunch();
  }, []);

  return { isFirstLaunch, loading };
}