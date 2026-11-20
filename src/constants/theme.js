export const COLORS = {
  primary: "#684563",
  primaryDark: "#29222B",
  primaryLight: "#936E89",
  primaryTint: "#EDE2EA",
  secondary: "#847982",
  accent: "#D98655",
  accentDark: "#B9673E",
  accentTint: "#F8E9DD",
  background: "#F7F3ED",
  surface: "#FFFEFB",
  surfaceAlt: "#EFE9E0",
  surfaceElevated: "#FCF9F4",
  text: "#29252A",
  textSecondary: "#68616A",
  textMuted: "#968D91",
  border: "#DED6CC",
  borderLight: "#EEE8DF",
  success: "#438271",
  successLight: "#E1EFE9",
  warning: "#BF8B36",
  warningLight: "#F8EED9",
  error: "#B94A4A",
  errorLight: "#F6E3E1",
  info: "#4C7182",
  infoLight: "#E2EDF0",
  overlay: "rgba(33, 21, 43, 0.5)",
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONTS = {
  regular: "System",
  medium: "System",
  bold: "System",
  // Familias de marca (requieren useFonts en App.js)
  display: "BebasNeue_400Regular",
  cuerpo: "Manrope_400Regular",
  medio: "Manrope_500Medium",
  semibold: "Manrope_600SemiBold",
  bold: "Manrope_700Bold",
  extrabold: "Manrope_800ExtraBold",
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    screen: 32,
    hero: 40,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: "#29222B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  md: {
    shadowColor: "#29222B",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  lg: {
    shadowColor: "#29222B",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.13,
    shadowRadius: 22,
    elevation: 7,
  },
};

// Aliases en español (compatibilidad)
export const COLORES = {
  primario: COLORS.primary,
  primarioOscuro: COLORS.primaryDark,
  primarioClaro: COLORS.primaryLight,
  secundario: COLORS.secondary,
  acento: COLORS.accent,
  acentoOscuro: COLORS.accentDark,
  acentoTinte: COLORS.accentTint,
  primarioTinte: COLORS.primaryTint,
  fondo: COLORS.background,
  superficie: COLORS.surface,
  superficieAlterna: COLORS.surfaceAlt,
  superficieElevada: COLORS.surfaceElevated,
  texto: COLORS.text,
  textoSecundario: COLORS.textSecondary,
  textoAtenuado: COLORS.textMuted,
  borde: COLORS.border,
  bordeSuave: COLORS.borderLight,
  exito: COLORS.success,
  exitoClaro: COLORS.successLight,
  advertencia: COLORS.warning,
  advertenciaClara: COLORS.warningLight,
  error: COLORS.error,
  errorClaro: COLORS.errorLight,
  info: COLORS.info,
  infoClaro: COLORS.infoLight,
  overlay: COLORS.overlay,
};
export const ESPACIADO = SPACING;
export const TAMAÑOS = SIZES;
export const FUENTES = FONTS;
export const RADIO = RADIUS;
export const SOMBRAS = SHADOWS;
