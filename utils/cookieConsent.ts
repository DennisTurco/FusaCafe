export const hasCookieConsent = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("cookieConsent") === "true";
};
