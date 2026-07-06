/* Zona 1: Importaciones */
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants/colors';
import { RADIUS, SHADOW } from '../constants/theme';
import { GradientHero } from '../components/GradientHero';
import { BarraInferior } from '../components/BarraInferior';
import { IconAvatar } from '../components/IconAvatar';
import { ICONS } from '../constants/icons';
import { tarjetasMock, analisisMock, alertasMock, usuarioMock } from '../data/mock';

/* Zona 2: Componente principal
   Objetivo: mostrar un resumen del estado financiero del usuario:
   tarjetas registradas, endeudamiento global, alertas activas y
   accesos rapidos a las demas secciones (RF01-RF05, interfaz I-03). */
export default function DashboardScreen({ pantallaActiva, onCambiarPantalla }) {
  const limiteTotal = tarjetasMock.reduce((suma, t) => suma + t.limite, 0);
  const saldoTotal = tarjetasMock.reduce((suma, t) => suma + t.saldoUtilizado, 0);
  const alertasActivas = alertasMock.filter((a) => a.activa);

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <GradientHero eyebrow={`Hola, ${usuarioMock.nombre.split(' ')[0]}`} title={`${analisisMock.utilizacionGlobal}%`} compact>
          <Text style={styles.heroDetalle}>
            Endeudamiento global · Nivel {analisisMock.nivelEndeudamiento}
          </Text>
          <Text style={styles.heroMonto}>
            ${saldoTotal.toLocaleString('es-MX')} usados de ${limiteTotal.toLocaleString('es-MX')}
          </Text>
        </GradientHero>

        <View style={styles.body}>
          <Text style={styles.seccion}>Tus tarjetas ({tarjetasMock.length})</Text>
          {tarjetasMock.map((t) => (
            <View key={t.id} style={styles.fila}>
              <IconAvatar imagen={ICONS.tarjetas} tono="primary" />
              <Text style={styles.filaTexto}>{t.alias} · {t.banco}</Text>
              <Text style={styles.filaSaldo}>${t.saldoUtilizado.toLocaleString('es-MX')}</Text>
            </View>
          ))}

          <Text style={styles.seccion}>Alertas activas ({alertasActivas.length})</Text>
          {alertasActivas.map((a) => (
            <View key={a.id} style={styles.fila}>
              <IconAvatar imagen={ICONS.alertas} tono="dark" />
              <View style={{ flex: 1 }}>
                <Text style={styles.filaTitulo}>{a.titulo}</Text>
                <Text style={styles.filaMensaje}>{a.mensaje}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <BarraInferior pantallaActiva={pantallaActiva} onCambiarPantalla={onCambiarPantalla} />
    </SafeAreaView>
  );
}

/* Zona 3: Estilos */
const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
  },
  heroDetalle: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: FONTS.medium,
    fontSize: 13,
    marginTop: 6,
  },
  heroMonto: {
    color: COLORS.silver,
    fontFamily: FONTS.regular,
    fontSize: 12,
    marginTop: 2,
  },
  body: {
    padding: 20,
    paddingBottom: 32,
  },
  seccion: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: COLORS.dark,
    marginTop: 12,
    marginBottom: 8,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 8,
    ...SHADOW.card,
  },
  filaTexto: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.dark,
  },
  filaSaldo: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.dark,
  },
  filaTitulo: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.dark,
  },
  filaMensaje: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.slate,
  },
});
