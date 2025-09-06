// constants/DesignSystem.ts
export const Colors = {
  // Couleurs de fond
  WHITE: "#FFFFFF",
  LIGHT_GRAY_BG: "#f1f3f5ff",
  RED_BG: "#E53935",
  GREEN_BG: "#4CAF50",
  DARK_GREEN_BG: "#27AE60",
  TRANSPARENT_WHITE: "rgba(255,255,255,0.9)",
  
  // Couleurs de texte
  WHITE_TEXT: "#FFFFFF",
  ORANGE_TEXT: "#FFA726",
  DARK_BLUE_TEXT: "#2C3E50",
  GRAY_TEXT: "#9E9E9E",
  DARK_GRAY_TEXT: "#7F8C8D",
  GREEN_TEXT: "#27AE60",
  
  // Couleurs d'icônes
  RED_ICON: "#E53935",
  GRAY_ICON: "#BDBDBD",
  ORANGE_ICON: "#FFA726",
  WHITE_ICON: "#FFFFFF",
  
  // Ombres
  SHADOW_COLOR: "#000000",
  GREEN_SHADOW: "#4CAF50",
};

export const Spacing = {
  XXS: 2,
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 32,
};

export const BorderRadius = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  CIRCULAR: 100,
};

export const Typography = {
  HEADLINE: {
    fontSize: 22,
    fontWeight: "700" as const,
    lineHeight: 28,
  },
  SUBHEAD: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 22,
  },
  BODY: {
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 20,
  },
  CAPTION: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
  },
  BADGE: {
    fontSize: 10,
    fontWeight: "700" as const,
    lineHeight: 12,
  },
  TINY: {
    fontSize: 8,
    fontWeight: "600" as const,
    lineHeight: 10,
  },
};

export const IconSize = {
  XS: 12,
  SM: 16,
  MD: 20,
  LG: 22,
  XL: 24,
  XXL: 28,
};

export const Elevation = {
  LOW: {
    shadowColor: Colors.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: Colors.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  HIGH: {
    shadowColor: Colors.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
};