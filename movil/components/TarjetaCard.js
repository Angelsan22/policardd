/* Tarjeta visual: representa una tarjeta de credito personal del usuario,
   con el mismo lenguaje visual (chip, degradado, logo) que las tarjetas
   de la web */
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../constants/colors';
import { RADIUS, SHADOW, GRADIENT_HERO } from '../constants/theme';

export const TarjetaCard = ({ alias, banco, limite, saldoUtilizado, fechaPago }) => {
  const utilizacion = limite > 0 ? Math.min(Math.round((saldoUtilizado / limite) * 100), 100) : 0;
  /* Un solo color (blanco) con opacidad variable: mas solido = mayor uso.
     Evita introducir rojo/verde y se mantiene dentro de la paleta de marca. */
  const colorBarra = utilizacion >= 70 ? 'rgba(255,255,255,0.95)' : utilizacion >= 40 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)';

  return (
    <LinearGradient colors={GRADIENT_HERO} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.tarjeta}>
      <View style={styles.chip} />
      <View style={styles.puntos}>
        {[0, 1, 2, 3].map((i) => <View key={i} style={styles.punto} />)}
      </View>

      <View style={styles.filaSuperior}>
        <Text style={styles.alias}>{alias}</Text>
        <Text style={styles.banco}>{banco}</Text>
      </View>

      <Text style={styles.saldo}>${saldoUtilizado.toLocaleString('es-MX')}</Text>
      <Text style={styles.limite}>de ${limite.toLocaleString('es-MX')} disponibles</Text>

      <View style={styles.barraFondo}>
        <View style={[styles.barraProgreso, { width: `${utilizacion}%`, backgroundColor: colorBarra }]} />
      </View>

      <View style={styles.filaInferior}>
        <Text style={styles.utilizacion}>{utilizacion}% utilizado</Text>
        <Text style={styles.fechaPago}>Pago: {fechaPago}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  tarjeta: {
    borderRadius: RADIUS.lg,
    padding: 20,
    marginVertical: 8,
    width: '100%',
    overflow: 'hidden',
    ...SHADOW.card,
  },
  chip: {
    width: 30,
    height: 22,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 14,
  },
  puntos: {
    position: 'absolute',
    top: 24,
    left: 60,
    flexDirection: 'row',
    gap: 4,
  },
  punto: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  filaSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  alias: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
  },
  banco: {
    color: COLORS.silver,
    fontFamily: FONTS.regular,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  saldo: {
    color: COLORS.white,
    fontFamily: FONTS.display,
    fontSize: 30,
  },
  limite: {
    color: COLORS.silver,
    fontFamily: FONTS.regular,
    fontSize: 12,
    marginBottom: 12,
  },
  barraFondo: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  barraProgreso: {
    height: 6,
    borderRadius: 3,
  },
  filaInferior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  utilizacion: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
  fechaPago: {
    color: COLORS.silver,
    fontFamily: FONTS.regular,
    fontSize: 12,
  },
});
