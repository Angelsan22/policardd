/* Zona 1: Importaciones */
import { useCallback, useState } from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { COLORS, FONTS } from '../constants/colors';
import { RADIUS, SHADOW } from '../constants/theme';
import { GradientHero } from '../components/GradientHero';
import { Boton } from '../components/Boton';
import { Badge } from '../components/Badge';
import { IconAvatar } from '../components/IconAvatar';
import { ICONS } from '../constants/icons';
import { useAuth } from '../data/auth';

const API_KEY_HEADER = 'policard-dev-api-key-CHANGE-ME';
const tonoNivel = { Alto: 'dark', Medio: 'slate', Bajo: 'primary' };
const colorNivel = (pct) => (pct >= 70 ? COLORS.dark : pct >= 40 ? COLORS.slate : COLORS.primary);

const clasificar = (pct) => (pct >= 70 ? 'Alto' : pct >= 40 ? 'Medio' : 'Bajo');

/* Zona 2: Componente principal
   Objetivo: calcular el nivel de utilizacion, endeudamiento y riesgo
   financiero del usuario a partir de sus tarjetas reales, generar
   recomendaciones y sugerir tarjetas del catalogo real de la API
   (RF01-RF05, interfaz I-05). */
export default function AnalizadorScreen() {
  const router = useRouter();
  const { sesion } = useAuth();
  const [misTarjetas, setMisTarjetas] = useState([]);
  const [ultimoGuardado, setUltimoGuardado] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [sugeridas, setSugeridas] = useState([]);
  const [generando, setGenerando] = useState(false);

  const encabezados = {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY_HEADER,
    Authorization: `Bearer ${sesion?.accessToken}`,
  };

  const cargarDatos = async () => {
    try {
      const respuestaTarjetas = await fetch('http://192.168.100.10:10000/api/v1/cliente/tarjetas-personales', {
        headers: encabezados,
      });
      const datosTarjetas = await respuestaTarjetas.json();
      setMisTarjetas(Array.isArray(datosTarjetas) ? datosTarjetas.map((t) => ({
        id: t.id, alias: t.alias, limite: t.limite, saldoUtilizado: t.saldo_utilizado,
      })) : []);

      const respuestaHistorial = await fetch('http://192.168.100.10:10000/api/v1/cliente/historial', {
        headers: encabezados,
      });
      const datosHistorial = await respuestaHistorial.json();
      if (Array.isArray(datosHistorial) && datosHistorial.length > 0) {
        setUltimoGuardado(datosHistorial[0]);
      }
    } catch (error) {
      console.log('Error de API', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const generarAnalisis = async () => {
    if (misTarjetas.length === 0) {
      Alert.alert('Sin tarjetas', 'Registra al menos una tarjeta en "Mis tarjetas" para generar un analisis');
      return;
    }

    setGenerando(true);
    const limiteTotal = misTarjetas.reduce((suma, t) => suma + t.limite, 0);
    const saldoTotal = misTarjetas.reduce((suma, t) => suma + t.saldoUtilizado, 0);
    const utilizacionGlobal = limiteTotal > 0 ? Math.round((saldoTotal / limiteTotal) * 100) : 0;
    const nivel = clasificar(utilizacionGlobal);

    const recomendaciones = [];
    const tarjetaAlta = misTarjetas.find((t) => t.limite > 0 && t.saldoUtilizado / t.limite >= 0.9);
    if (tarjetaAlta) {
      recomendaciones.push(`Reduce el saldo de tu ${tarjetaAlta.alias}, esta al ${Math.round((tarjetaAlta.saldoUtilizado / tarjetaAlta.limite) * 100)}% de su limite.`);
    }
    recomendaciones.push('Paga antes de la fecha de corte para evitar intereses.');
    if (nivel === 'Alto') {
      recomendaciones.push('Evita solicitar una tarjeta nueva hasta bajar tu endeudamiento global.');
    }

    setResultado({ utilizacionGlobal, nivelEndeudamiento: nivel, riesgoFinanciero: nivel, recomendaciones });

    try {
      await fetch('http://192.168.100.10:10000/api/v1/cliente/historial', {
        method: 'POST',
        headers: encabezados,
        body: JSON.stringify({
          utilizacion_global: utilizacionGlobal,
          nivel_endeudamiento: nivel,
          riesgo_financiero: nivel,
        }),
      });

      if (nivel === 'Alto') {
        await fetch('http://192.168.100.10:10000/api/v1/cliente/alertas', {
          method: 'POST',
          headers: encabezados,
          body: JSON.stringify({
            titulo: 'Riesgo financiero alto detectado',
            mensaje: `Tu utilizacion de credito llego al ${utilizacionGlobal}%`,
            fecha: new Date().toISOString().slice(0, 10),
            tipo: 'riesgo',
          }),
        });
      }

      const respuestaCatalogo = await fetch('http://192.168.100.10:10000/api/v1/tarjetas', {
        headers: { 'X-API-Key': API_KEY_HEADER },
      });
      const catalogo = await respuestaCatalogo.json();
      if (Array.isArray(catalogo)) {
        setSugeridas([...catalogo].sort((a, b) => a.cat - b.cat).slice(0, 3));
      }

      cargarDatos();
    } catch (error) {
      console.log('Error de API', error);
    } finally {
      setGenerando(false);
    }
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <GradientHero eyebrow="Analizador financiero" title="Tu diagnostico" compact />

        <View style={styles.body}>
          <Boton titulo={generando ? 'Generando...' : 'Generar analisis'} onPress={generarAnalisis} disabled={generando} />

          {ultimoGuardado && (
            <Pressable style={styles.filaUltimo} onPress={() => router.push('/historial')}>
              <IconAvatar imagen={ICONS.historial} tono="primary" tamano={34} />
              <View style={{ flex: 1 }}>
                <Text style={styles.filaUltimoLabel}>Ultimo analisis guardado</Text>
                <Text style={styles.filaUltimoFecha}>{ultimoGuardado.fecha}</Text>
              </View>
              <Badge texto={ultimoGuardado.riesgo_financiero} tono={tonoNivel[ultimoGuardado.riesgo_financiero]} />
              <Image source={ICONS.detalle} style={styles.iconoDetalle} resizeMode="contain" />
            </Pressable>
          )}

          {resultado && (
            <>
              <View style={styles.grupoIndicadores}>
                <View style={styles.indicador}>
                  <Text style={styles.indicadorValor}>{resultado.utilizacionGlobal}%</Text>
                  <Text style={styles.indicadorEtiqueta}>Utilizacion</Text>
                </View>
                <View style={styles.indicador}>
                  <Badge texto={resultado.nivelEndeudamiento} tono={tonoNivel[resultado.nivelEndeudamiento]} />
                  <Text style={styles.indicadorEtiqueta}>Endeudamiento</Text>
                </View>
                <View style={styles.indicador}>
                  <Badge texto={resultado.riesgoFinanciero} tono={tonoNivel[resultado.riesgoFinanciero]} />
                  <Text style={styles.indicadorEtiqueta}>Riesgo</Text>
                </View>
              </View>

              <Text style={styles.seccion}>Utilizacion por tarjeta</Text>
              {misTarjetas.map((t) => {
                const pct = t.limite > 0 ? Math.round((t.saldoUtilizado / t.limite) * 100) : 0;
                return (
                  <View key={t.id} style={styles.filaTarjeta}>
                    <View style={styles.filaTarjetaTop}>
                      <Text style={styles.filaTarjetaTexto}>{t.alias}</Text>
                      <Text style={[styles.filaTarjetaPct, { color: colorNivel(pct) }]}>{pct}%</Text>
                    </View>
                    <View style={styles.barraFondo}>
                      <View style={[styles.barraProgreso, { width: `${pct}%`, backgroundColor: colorNivel(pct) }]} />
                    </View>
                  </View>
                );
              })}

              <Text style={styles.seccion}>Recomendaciones</Text>
              {resultado.recomendaciones.map((rec, i) => (
                <View key={i} style={styles.filaRecomendacion}>
                  <IconAvatar imagen={ICONS.recomendaciones} tono="primary" tamano={34} />
                  <Text style={styles.recomendacionTexto}>{rec}</Text>
                </View>
              ))}

              <Text style={styles.seccion}>Tarjetas sugeridas</Text>
              <Text style={styles.seccionNota}>Consultado en el catalogo de la API de PoliCard</Text>
              {sugeridas.map((s) => (
                <View key={s.id} style={styles.tarjetaSugerida}>
                  <View style={styles.sugeridaTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sugeridaNombre}>{s.nombre}</Text>
                      <Text style={styles.sugeridaBanco}>{s.banco}</Text>
                    </View>
                    <Badge texto={s.anualidad === 0 ? 'Sin anualidad' : `Anualidad $${s.anualidad}`} tono="primary" />
                  </View>
                  <Text style={styles.sugeridaMotivo}>{s.beneficios} · CAT {s.cat}%</Text>
                </View>
              ))}
            </>
          )}
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
  body: {
    padding: 20,
    paddingBottom: 32,
  },
  filaUltimo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 12,
    marginTop: 12,
    marginBottom: 8,
    ...SHADOW.card,
  },
  iconoDetalle: {
    width: 18,
    height: 18,
  },
  filaUltimoLabel: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.slate,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  filaUltimoFecha: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.dark,
    marginTop: 2,
  },
  grupoIndicadores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 8,
    ...SHADOW.card,
  },
  indicador: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  indicadorValor: {
    fontFamily: FONTS.display,
    fontSize: 24,
    color: COLORS.dark,
  },
  indicadorEtiqueta: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.slate,
  },
  seccion: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: COLORS.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  filaTarjeta: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    padding: 12,
    marginBottom: 8,
    ...SHADOW.card,
  },
  filaTarjetaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  filaTarjetaTexto: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.dark,
  },
  filaTarjetaPct: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
  },
  barraFondo: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  barraProgreso: {
    height: 6,
    borderRadius: 3,
  },
  filaRecomendacion: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    padding: 12,
    marginBottom: 8,
    ...SHADOW.card,
  },
  recomendacionTexto: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.dark,
  },
  seccionNota: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.slate,
    marginTop: -6,
    marginBottom: 8,
  },
  tarjetaSugerida: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    padding: 14,
    marginBottom: 8,
    ...SHADOW.card,
  },
  sugeridaTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 6,
  },
  sugeridaNombre: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.dark,
  },
  sugeridaBanco: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.slate,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sugeridaMotivo: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.slate,
  },
});
