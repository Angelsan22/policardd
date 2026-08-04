/* Zona 1: Importaciones */
import { useCallback, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { COLORS, FONTS } from '../constants/colors';
import { RADIUS, SHADOW } from '../constants/theme';
import { GradientHero } from '../components/GradientHero';
import { IconAvatar } from '../components/IconAvatar';
import { ICONS } from '../constants/icons';
import { useAuth } from '../data/auth';

const API_KEY_HEADER = 'policard-dev-api-key-CHANGE-ME';

/* Zona 2: Componente principal
   Objetivo: mostrar un resumen del estado financiero real del usuario:
   tarjetas registradas, endeudamiento global, alertas activas y
   accesos rapidos a las demas secciones (RF01-RF05, interfaz I-03). */
export default function DashboardScreen() {
  const { sesion } = useAuth();
  const [tarjetas, setTarjetas] = useState([]);
  const [alertasActivas, setAlertasActivas] = useState([]);
  const [ultimoAnalisis, setUltimoAnalisis] = useState(null);

  const encabezados = {
    'X-API-Key': API_KEY_HEADER,
    Authorization: `Bearer ${sesion?.accessToken}`,
  };

  const cargarResumen = async () => {
    try {
      const respuestaTarjetas = await fetch('http://192.168.100.10:10000/api/v1/cliente/tarjetas-personales', {
        headers: encabezados,
      });
      const datosTarjetas = await respuestaTarjetas.json();
      setTarjetas(Array.isArray(datosTarjetas) ? datosTarjetas.map((t) => ({
        id: t.id, alias: t.alias, banco: t.banco, saldoUtilizado: t.saldo_utilizado, limite: t.limite,
      })) : []);

      const respuestaAlertas = await fetch('http://192.168.100.10:10000/api/v1/cliente/alertas', {
        headers: encabezados,
      });
      const datosAlertas = await respuestaAlertas.json();
      setAlertasActivas(Array.isArray(datosAlertas) ? datosAlertas.filter((a) => a.activa) : []);

      const respuestaHistorial = await fetch('http://192.168.100.10:10000/api/v1/cliente/historial', {
        headers: encabezados,
      });
      const datosHistorial = await respuestaHistorial.json();
      if (Array.isArray(datosHistorial) && datosHistorial.length > 0) {
        setUltimoAnalisis(datosHistorial[0]);
      }
    } catch (error) {
      console.log('Error de API', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarResumen();
    }, [])
  );

  const limiteTotal = tarjetas.reduce((suma, t) => suma + t.limite, 0);
  const saldoTotal = tarjetas.reduce((suma, t) => suma + t.saldoUtilizado, 0);
  const utilizacionGlobal = ultimoAnalisis
    ? ultimoAnalisis.utilizacion_global
    : (limiteTotal > 0 ? Math.round((saldoTotal / limiteTotal) * 100) : 0);
  const nivelEndeudamiento = ultimoAnalisis ? ultimoAnalisis.nivel_endeudamiento : '--';

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <GradientHero eyebrow={`Hola, ${sesion?.nombre?.split(' ')[0] || ''}`} title={`${utilizacionGlobal}%`} compact>
          <Text style={styles.heroDetalle}>
            Endeudamiento global · Nivel {nivelEndeudamiento}
          </Text>
          <Text style={styles.heroMonto}>
            ${saldoTotal.toLocaleString('es-MX')} usados de ${limiteTotal.toLocaleString('es-MX')}
          </Text>
        </GradientHero>

        <View style={styles.body}>
          <Text style={styles.seccion}>Tus tarjetas ({tarjetas.length})</Text>
          {tarjetas.map((t) => (
            <View key={t.id} style={styles.fila}>
              <IconAvatar imagen={ICONS.tarjetas} tono="primary" />
              <Text style={styles.filaTexto}>{t.alias} · {t.banco}</Text>
              <Text style={styles.filaSaldo}>${t.saldoUtilizado.toLocaleString('es-MX')}</Text>
            </View>
          ))}
          {tarjetas.length === 0 && <Text style={styles.vacio}>Aun no registras tarjetas</Text>}

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
          {alertasActivas.length === 0 && <Text style={styles.vacio}>No tienes alertas activas</Text>}
        </View>
      </ScrollView>
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
  vacio: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.slate,
    marginBottom: 8,
  },
});
