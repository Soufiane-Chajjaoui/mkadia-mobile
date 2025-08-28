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
          await AsyncStorage.setItem("alreadyLaunched", "true");
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (e) {
        console.error("Error checking first launch:", e);
      } finally {
        setLoading(false);
      }
    }
    checkFirstLaunch();
  }, []);

  return { isFirstLaunch, loading };
}
