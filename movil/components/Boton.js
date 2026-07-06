/* Boton reutilizable con variantes: primario, secundario, contorno y claro */
import { Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/colors';
import { RADIUS, SHADOW } from '../constants/theme';

export const Boton = ({ titulo, onPress, variante = 'primario', disabled = false }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variante === 'primario' && styles.primario,
        variante === 'secundario' && styles.secundario,
        variante === 'contorno' && styles.contorno,
        variante === 'claro' && styles.claro,
        pressed && !disabled && styles.presionado,
        disabled && styles.deshabilitado,
      ]}
    >
      <Text
        style={[
          styles.texto,
          variante === 'contorno' && styles.textoContorno,
          variante === 'claro' && styles.textoClaro,
        ]}
      >
        {titulo}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  primario: {
    backgroundColor: COLORS.primary,
    ...SHADOW.card,
  },
  secundario: {
    backgroundColor: COLORS.dark,
    ...SHADOW.card,
  },
  contorno: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  claro: {
    backgroundColor: COLORS.white,
  },
  presionado: {
    opacity: 0.75,
  },
  deshabilitado: {
    opacity: 0.4,
  },
  texto: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
  },
  textoContorno: {
    color: COLORS.primary,
  },
  textoClaro: {
    color: COLORS.dark,
  },
});
