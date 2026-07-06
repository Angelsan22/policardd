/* Zona 1: Importaciones */
import { useState } from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../constants/colors';
import { RADIUS, SHADOW } from '../constants/theme';
import { GradientHero } from '../components/GradientHero';
import { BarraInferior } from '../components/BarraInferior';
import { IconAvatar } from '../components/IconAvatar';
import { Badge } from '../components/Badge';
import { ICONS } from '../constants/icons';
import { historialMock } from '../data/mock';

const tonoRiesgo = { Alto: 'dark', Medio: 'slate', Bajo: 'primary' };

/* Zona 2: Componente principal
   Objetivo: consultar los analisis financieros generados previamente,
   compararlos entre si y eliminar registros (RF01-RF05, interfaz I-07). */
export default function HistorialScreen({ pantallaActiva, onCambiarPantalla, onRegresar }) {
  const [historial, setHistorial] = useState(historialMock);
  const [seleccionado, setSeleccionado] = useState(null);
  const [modoComparar, setModoComparar] = useState(false);
  const [comparar, setComparar] = useState([]);

  const alternarModoComparar = () => {
    setModoComparar(!modoComparar);
    setComparar([]);
  };

  const alternarSeleccionComparar = (id) => {
    if (comparar.includes(id)) {
      setComparar(comparar.filter((c) => c !== id));
    } else if (comparar.length < 2) {
      setComparar([...comparar, id]);
    }
  };

  const eliminarRegistro = (id) => {
    Alert.alert('Eliminar registro', 'Se eliminara este analisis del historial', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setHistorial(historial.filter((h) => h.id !== id)) },
    ]);
  };

  const [idA, idB] = comparar;
  const analisisA = historial.find((h) => h.id === idA);
  const analisisB = historial.find((h) => h.id === idB);

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <GradientHero eyebrow="Seguimiento" title="Historial de analisis" compact onRegresar={onRegresar} />

        <View style={styles.body}>
          <Pressable style={styles.botonComparar} onPress={alternarModoComparar}>
            <Ionicons name={modoComparar ? 'close' : 'git-compare-outline'} size={18} color={COLORS.white} />
            <Text style={styles.botonCompararTexto}>{modoComparar ? 'Cancelar comparacion' : 'Comparar analisis'}</Text>
          </Pressable>

          {modoComparar && (
            <Text style={styles.instruccion}>
              Selecciona dos analisis {comparar.length}/2
            </Text>
          )}

          {modoComparar && analisisA && analisisB && (
            <View style={styles.comparativa}>
              <Text style={styles.comparativaTitulo}>Comparativa</Text>
              <View style={styles.comparativaFila}>
                <Text style={styles.comparativaFecha}>{analisisA.fecha}</Text>
                <Text style={styles.comparativaFecha}>{analisisB.fecha}</Text>
              </View>
              <View style={styles.comparativaFila}>
                <Text style={styles.comparativaValor}>{analisisA.utilizacionGlobal}%</Text>
                <Text style={styles.comparativaValor}>{analisisB.utilizacionGlobal}%</Text>
              </View>
              <Text style={styles.comparativaDelta}>
                {analisisB.utilizacionGlobal > analisisA.utilizacionGlobal
                  ? `Tu utilizacion subio ${analisisB.utilizacionGlobal - analisisA.utilizacionGlobal} puntos`
                  : analisisB.utilizacionGlobal < analisisA.utilizacionGlobal
                  ? `Tu utilizacion bajo ${analisisA.utilizacionGlobal - analisisB.utilizacionGlobal} puntos`
                  : 'Tu utilizacion se mantuvo igual'}
              </Text>
              <View style={styles.comparativaFila}>
                <Badge texto={analisisA.riesgoFinanciero} tono={tonoRiesgo[analisisA.riesgoFinanciero]} />
                <Badge texto={analisisB.riesgoFinanciero} tono={tonoRiesgo[analisisB.riesgoFinanciero]} />
              </View>
            </View>
          )}

          {historial.map((h) => {
            const expandido = seleccionado === h.id;
            const marcado = comparar.includes(h.id);
            return (
              <Pressable
                key={h.id}
                style={[styles.tarjeta, modoComparar && marcado && styles.tarjetaMarcada]}
                onPress={() => (modoComparar ? alternarSeleccionComparar(h.id) : setSeleccionado(expandido ? null : h.id))}
              >
                <View style={styles.filaSuperior}>
                  {modoComparar ? (
                    <Ionicons
                      name={marcado ? 'checkmark-circle' : 'ellipse-outline'}
                      size={22}
                      color={marcado ? COLORS.primary : COLORS.silver}
                    />
                  ) : (
                    <IconAvatar imagen={ICONS.historial} tono="primary" tamano={34} />
                  )}
                  <Text style={styles.fecha}>{h.fecha}</Text>
                  <Badge texto={h.riesgoFinanciero} tono={tonoRiesgo[h.riesgoFinanciero]} />
                  {!modoComparar && (
                    <Pressable onPress={() => eliminarRegistro(h.id)} style={styles.botonEliminar}>
                      <Image source={ICONS.eliminar} style={styles.iconoEliminar} resizeMode="contain" />
                    </Pressable>
                  )}
                </View>
                {expandido && !modoComparar && (
                  <View style={styles.detalle}>
                    <Text style={styles.detalleTexto}>Utilizacion global: {h.utilizacionGlobal}%</Text>
                    <Text style={styles.detalleTexto}>Nivel de riesgo: {h.riesgoFinanciero}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
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
  botonComparar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    marginBottom: 12,
    ...SHADOW.card,
  },
  botonCompararTexto: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 13,
  },
  instruccion: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.slate,
    marginBottom: 10,
    textAlign: 'center',
  },
  comparativa: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 14,
    ...SHADOW.card,
  },
  comparativaTitulo: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 10,
  },
  comparativaFila: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  comparativaFecha: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.slate,
  },
  comparativaValor: {
    fontFamily: FONTS.display,
    fontSize: 22,
    color: COLORS.dark,
  },
  comparativaDelta: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.slate,
    textAlign: 'center',
    marginBottom: 8,
  },
  tarjeta: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 10,
    ...SHADOW.card,
  },
  tarjetaMarcada: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  filaSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fecha: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.dark,
  },
  botonEliminar: {
    padding: 2,
  },
  iconoEliminar: {
    width: 16,
    height: 16,
  },
  detalle: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  detalleTexto: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.slate,
    marginBottom: 2,
  },
});
