/* Encabezado degradado (Azul Medianoche -> Azul Acero) con blobs decorativos,
   igual que las secciones "hero" de la plataforma web de PoliCard. */
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../constants/colors';
import { GRADIENT_HERO } from '../constants/theme';
import { ICONS } from '../constants/icons';

export const GradientHero = ({ eyebrow, title, subtitle, onRegresar, compact, children }) => {
  return (
    <LinearGradient
      colors={GRADIENT_HERO}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.hero, compact && styles.heroCompact]}
    >
      <View style={styles.blobA} pointerEvents="none" />
      <View style={styles.blobB} pointerEvents="none" />

      {onRegresar && (
        <Pressable onPress={onRegresar} style={styles.botonRegresar}>
          <Image source={ICONS.regresar} style={styles.iconoRegresar} resizeMode="contain" />
        </Pressable>
      )}

      {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
      {title && <Text style={[styles.titulo, compact && styles.tituloCompact]}>{title}</Text>}
      {subtitle && <Text style={styles.subtitulo}>{subtitle}</Text>}
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  hero: {
    paddingTop: 18,
    paddingBottom: 34,
    paddingHorizontal: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  heroCompact: {
    paddingBottom: 22,
  },
  blobA: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  blobB: {
    position: 'absolute',
    bottom: -60,
    left: '30%',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  botonRegresar: {
    marginBottom: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconoRegresar: {
    width: 18,
    height: 18,
  },
  eyebrow: {
    color: COLORS.silver,
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  titulo: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 26,
  },
  tituloCompact: {
    fontSize: 21,
  },
  subtitulo: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONTS.regular,
    fontSize: 13,
    marginTop: 4,
  },
});
