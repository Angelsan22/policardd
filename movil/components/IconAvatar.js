/* Icono dentro de un cuadro redondeado con tinte de color, igual que
   .notif-icon / .sc-icon / .my-card-icon en la web. Acepta un icono de
   Ionicons (nombre) o un PNG propio de la marca (imagen). */
import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TONES } from '../constants/colors';
import { RADIUS } from '../constants/theme';

export const IconAvatar = ({ nombre, imagen, tono = 'primary', tamano = 40 }) => {
  const paleta = TONES[tono] || TONES.primary;
  const tamanoIcono = Math.round(tamano * 0.5);
  return (
    <View
      style={[
        styles.contenedor,
        { width: tamano, height: tamano, borderRadius: RADIUS.sm, backgroundColor: paleta.bg },
      ]}
    >
      {imagen ? (
        <Image source={imagen} style={{ width: tamanoIcono, height: tamanoIcono }} resizeMode="contain" />
      ) : (
        <Ionicons name={nombre} size={tamanoIcono} color={paleta.fg} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
