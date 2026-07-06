/* Pill de estado con tinte suave, igual que .badge-estudiante/.badge-tipo en la web */
import { View, Text, StyleSheet } from 'react-native';
import { FONTS, TONES } from '../constants/colors';
import { RADIUS } from '../constants/theme';

export const Badge = ({ texto, tono = 'primary' }) => {
  const paleta = TONES[tono] || TONES.primary;
  return (
    <View style={[styles.badge, { backgroundColor: paleta.bg }]}>
      <Text style={[styles.texto, { color: paleta.fg }]}>{texto}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
  },
  texto: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
