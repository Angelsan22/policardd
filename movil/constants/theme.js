import { COLORS } from './colors';

/* Radios de esquina, consistentes con el look "tarjeta redondeada" de la web */
export const RADIUS = { sm: 10, md: 14, lg: 20, xl: 26, pill: 999 };

/* Sombras suaves con tinte navy, igual que --sombra / --sombra-lg en la web */
export const SHADOW = {
  card: {
    shadowColor: COLORS.dark,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  lifted: {
    shadowColor: COLORS.dark,
    shadowOpacity: 0.18,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
};

/* Degradado de marca: Azul Medianoche -> Azul Acero, usado en heros y tarjetas */
export const GRADIENT_HERO = [COLORS.dark, COLORS.primary];
