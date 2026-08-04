/* Barra de navegacion inferior: tabBar personalizado para el Tabs de
   expo-router (recibe {state, descriptors, navigation} como cualquier
   tabBar custom de React Navigation), mismo diseno visual de siempre */
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS, TONES } from '../constants/colors';
import { RADIUS } from '../constants/theme';
import { ICONS } from '../constants/icons';

const ICONO_POR_RUTA = {
  index: ICONS.inicio,
  tarjetas: ICONS.tarjetas,
  analizador: ICONS.analisis,
  alertas: ICONS.alertas,
  perfil: ICONS.perfil,
};

export const BarraInferior = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.barra}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const etiqueta = options.title ?? route.name;
        const activo = state.index === index;

        const irATab = () => {
          const evento = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!activo && !evento.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} style={styles.tab} onPress={irATab}>
            <View style={[styles.pildora, activo && { backgroundColor: TONES.primary.bg }]}>
              <Image source={ICONO_POR_RUTA[route.name]} style={[styles.icono, !activo && styles.iconoInactivo]} resizeMode="contain" />
            </View>
            <Text style={[styles.etiqueta, activo && styles.etiquetaActiva]}>{etiqueta}</Text>
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
