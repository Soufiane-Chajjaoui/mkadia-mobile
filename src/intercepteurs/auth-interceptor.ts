import AsyncStorage from "@react-native-async-storage/async-storage";
import { TokenType } from "../enums/TokenType";
import { urlsHasResetToken } from "../constants/urls";
import axios from "./url-encoded-body";

axios.interceptors.request.use(
  async (config) => {

    const urlHasReset = urlsHasResetToken.some((resetUrl) => config.url?.includes(resetUrl));

    if (urlHasReset) {
      try {
        const resetToken = await AsyncStorage.getItem(TokenType.RESET_TOKEN);

        if (resetToken && resetToken.trim() !== '') {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${resetToken}`;
        } else {
          delete config.headers?.Authorization;
        }
      } catch (error) {
        delete config.headers?.Authorization;
      }
    } else {
      console.log("ℹ️ Cette URL ne nécessite pas de reset token");
    }

    console.log("📋 Headers finaux:", JSON.stringify(config.headers, null, 2));
    console.log("🏁 ========== INTERCEPTOR END ==========");

    return config;
  },
  (error) => {
    console.error("❌ Erreur dans l'intercepteur:", error);
    return Promise.reject(error);
  }
);

export default axios;