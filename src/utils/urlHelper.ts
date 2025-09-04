import { environment } from "../config/environment";

export const replaceBaseUrl = (url: string) => {
  if (!url) return "";
  return url.replace("http://localhost:9000/mkadia-objects", `${environment.mediaHost}`);
};
