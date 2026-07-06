/* Barra de navegacion inferior: cambia la pantalla activa mediante estado (sin libreria de navegacion) */
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS, TONES } from '../constants/colors';
import { RADIUS } from '../constants/theme';
import { ICONS } from '../constants/icons';

const TABS = [
  { clave: 'dashboard', etiqueta: 'Inicio', icono: ICONS.inicio },
  { clave: 'tarjetas', etiqueta: 'Tarjetas', icono: ICONS.tarjetas },
  { clave: 'analizador', etiqueta: 'Analisis', icono: ICONS.analisis },
  { clave: 'alertas', etiqueta: 'Alertas', icono: ICONS.alertas },
  { clave: 'perfil', etiqueta: 'Perfil', icono: ICONS.perfil },
];

export const BarraInferior = ({ pantallaActiva, onCambiarPantalla }) => {
  return (
    <View style={styles.barra}>
      {TABS.map((tab) => {
        const activo = pantallaActiva === tab.clave;
        return (
          <Pressable key={tab.clave} style={styles.tab} onPress={() => onCambiarPantalla(tab.clave)}>
            <View style={[styles.pildora, activo && { backgroundColor: TONES.primary.bg }]}>
              <Image source={tab.icono} style={[styles.icono, !activo && styles.iconoInactivo]} resizeMode="contain" />
            </View>
            <Text style={[styles.etiqueta, activo && styles.etiquetaActiva]}>{tab.etiqueta}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingTop: 10,
    paddingBottom: 12,
    shadowColor: COLORS.dark,
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  pildora: {
    width: 38,
    height: 30,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icono: {
    width: 20,
    height: 20,
  },
  iconoInactivo: {
    opacity: 0.45,
  },
  etiqueta: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.slate,
  },
  etiquetaActiva: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
  },
});
