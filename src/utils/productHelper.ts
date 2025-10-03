export const isExpired = (dateString?: string) => {
  if (!dateString) return false;
  const today = new Date();
  const expiry = new Date(dateString);
  return expiry < today; // true si la date est passée
};