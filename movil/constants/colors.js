/* Paleta de colores de PoliCard Smart */
export const COLORS = {
  primary: '#4682B4',
  dark: '#191970',
  silver: '#C0C0C0',
  background: '#F5F5F5',
  slate: '#708090',
  white: '#FFFFFF',
  error: '#D32F2F',
  success: '#2E7D32',
};

/* Tipografia: Inter para UI/datos (estilo BBVA), DM Serif Display para
   titulos y montos grandes, en linea con la marca web de PoliCard. */
export const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  display: 'DMSerifDisplay_400Regular',
};

/* Tintes suaves para badges e iconos-avatar. Solo con la paleta de marca
   (primary/dark/slate) - sin rojo ni verde, para una lectura sobria. */
export const TONES = {
  primary: { bg: '#E4EDF4', fg: COLORS.primary },
  dark: { bg: '#E3E3EF', fg: COLORS.dark },
  slate: { bg: '#EAEDEF', fg: COLORS.slate },
};
