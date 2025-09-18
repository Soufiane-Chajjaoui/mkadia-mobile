import axios from "axios";
import { urlPatternsEncodedBody } from "../constants/urls";


function toFormUrlEncoded(body: any): string {
  const formBody: string[] = [];
  for (const key in body) {
    if (body.hasOwnProperty(key)) {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(body[key]);
      formBody.push(`${encodedKey}=${encodedValue}`);
    }
  }
  return formBody.join('&');
}


axios.interceptors.request.use(
  async (config) => {

    const urlHasReset = urlPatternsEncodedBody.some((resetUrl) => config.url?.includes(resetUrl));

    if (urlHasReset) {
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";
        config.data = toFormUrlEncoded(config.data);
    }
    return config;
  },
  (error) => {
    console.error("❌ Erreur dans l'intercepteur:", error);
    return Promise.reject(error);
  }
);

export default axios;