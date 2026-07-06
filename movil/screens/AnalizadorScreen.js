/* Zona 1: Importaciones */
import { useState } from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants/colors';
import { RADIUS, SHADOW } from '../constants/theme';
import { GradientHero } from '../components/GradientHero';
import { BarraInferior } from '../components/BarraInferior';
import { Boton } from '../components/Boton';
import { Badge } from '../components/Badge';
import { IconAvatar } from '../components/IconAvatar';
import { ICONS } from '../constants/icons';
import { tarjetasMock, analisisMock, tarjetasSugeridasMock } from '../data/mock';

const tonoNivel = { Alto: 'dark', Medio: 'slate', Bajo: 'primary' };
const colorNivel = (pct) => (pct >= 70 ? COLORS.dark : pct >= 40 ? COLORS.slate : COLORS.primary);

/* Zona 2: Componente principal
   Objetivo: calcular el nivel de utilizacion, endeudamiento y riesgo
   financiero del usuario, y generar recomendaciones personalizadas
   (RF01-RF05, interfaz I-05). */
export default function AnalizadorScreen({ pantallaActiva, onCambiarPantalla }) {
  const [resultado, setResultado] = useState(null);

  const generarAnalisis = () => {
    setResultado(analisisMock);
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <GradientHero eyebrow="Analizador financiero" title="Tu diagnostico" compact />

        <View style={styles.body}>
          <Boton titulo="Generar analisis" onPress={generarAnalisis} />

          <Pressable style={styles.filaUltimo} onPress={() => onCambiarPantalla('historial')}>
            <IconAvatar imagen={ICONS.historial} tono="primary" tamano={34} />
            <View style={{ flex: 1 }}>
              <Text style={styles.filaUltimoLabel}>Ultimo analisis guardado</Text>
              <Text style={styles.filaUltimoFecha}>{analisisMock.fecha}</Text>
            </View>
            <Badge texto={analisisMock.riesgoFinanciero} tono={tonoNivel[analisisMock.riesgoFinanciero]} />
            <Image source={ICONS.detalle} style={styles.iconoDetalle} resizeMode="contain" />
          </Pressable>

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
              {tarjetasMock.map((t) => {
                const pct = Math.round((t.saldoUtilizado / t.limite) * 100);
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
              {tarjetasSugeridasMock.map((s) => (
                <View key={s.id} style={styles.tarjetaSugerida}>
                  <View style={styles.sugeridaTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sugeridaNombre}>{s.nombre}</Text>
                      <Text style={styles.sugeridaBanco}>{s.banco}</Text>
                    </View>
                    <Badge texto={s.anualidad === 0 ? 'Sin anualidad' : `Anualidad $${s.anualidad}`} tono="primary" />
                  </View>
                  <Text style={styles.sugeridaMotivo}>{s.motivo} · CAT {s.cat}%</Text>
                </View>
              ))}
            </>
          )}
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
