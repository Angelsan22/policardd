/* Zona 1: Importaciones */
import { useState } from 'react';
import { ScrollView, View, Text, Image, Switch, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../constants/colors';
import { RADIUS, SHADOW } from '../constants/theme';
import { GradientHero } from '../components/GradientHero';
import { BarraInferior } from '../components/BarraInferior';
import { IconAvatar } from '../components/IconAvatar';
import { Input } from '../components/Input';
import { Boton } from '../components/Boton';
import { ICONS } from '../constants/icons';
import { alertasMock } from '../data/mock';

const imagenPorTipo = { pago: ICONS.pago, riesgo: ICONS.riesgo };
const tonoPorTipo = { pago: 'primary', corte: 'dark', riesgo: 'slate' };
const TIPOS = [
  { clave: 'pago', etiqueta: 'Pago' },
  { clave: 'corte', etiqueta: 'Corte' },
  { clave: 'riesgo', etiqueta: 'Riesgo' },
];

/* Zona 2: Componente principal
   Objetivo: programar, listar y cancelar recordatorios de fechas de
   pago, corte o de riesgo financiero alto (RF01-RF05, interfaz I-06). */
export default function AlertasScreen({ pantallaActiva, onCambiarPantalla }) {
  const [alertas, setAlertas] = useState(alertasMock);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [fecha, setFecha] = useState('');
  const [tipo, setTipo] = useState('pago');

  const alternarActiva = (id) => {
    setAlertas(alertas.map((a) => (a.id === id ? { ...a, activa: !a.activa } : a)));
  };

  const eliminarAlerta = (id) => {
    setAlertas(alertas.filter((a) => a.id !== id));
  };

  const crearAlerta = () => {
    if (!titulo.trim() || !fecha.trim()) {
      Alert.alert('Faltan datos', 'Ingresa al menos el titulo y la fecha del recordatorio');
      return;
    }
    setAlertas([{ id: Date.now(), titulo, mensaje, fecha, tipo, activa: true }, ...alertas]);
    setTitulo(''); setMensaje(''); setFecha(''); setTipo('pago');
    setMostrarForm(false);
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <GradientHero eyebrow="Recordatorios" title="Alertas" compact />

        <View style={styles.body}>
          <Pressable style={styles.botonAgregar} onPress={() => setMostrarForm(!mostrarForm)}>
            {mostrarForm ? (
              <Ionicons name="close" size={18} color={COLORS.primary} />
            ) : (
              <Image source={ICONS.agregar} style={styles.iconoAgregar} resizeMode="contain" />
            )}
            <Text style={styles.botonAgregarTexto}>{mostrarForm ? 'Cancelar' : 'Nueva alerta'}</Text>
          </Pressable>

          {mostrarForm && (
            <View style={styles.formulario}>
              <Text style={styles.formularioEtiqueta}>Tipo de alerta</Text>
              <View style={styles.filaTipos}>
                {TIPOS.map((t) => {
                  const activo = tipo === t.clave;
                  return (
                    <Pressable
                      key={t.clave}
                      onPress={() => setTipo(t.clave)}
                      style={[styles.chipTipo, activo && styles.chipTipoActivo]}
                    >
                      <Text style={[styles.chipTipoTexto, activo && styles.chipTipoTextoActivo]}>{t.etiqueta}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Input etiqueta="Titulo" valor={titulo} onChangeText={setTitulo} placeholder="Pago Tarjeta Clasica" />
              <Input etiqueta="Mensaje" valor={mensaje} onChangeText={setMensaje} placeholder="Vence el 15 de julio" />
              <Input etiqueta="Fecha" valor={fecha} onChangeText={setFecha} placeholder="2026-07-15" />
              <Boton titulo="Programar alerta" onPress={crearAlerta} />
            </View>
          )}

          {alertas.map((a) => (
            <View key={a.id} style={styles.tarjetaAlerta}>
              {imagenPorTipo[a.tipo] ? (
                <IconAvatar imagen={imagenPorTipo[a.tipo]} tono={tonoPorTipo[a.tipo] || 'primary'} />
              ) : (
                <IconAvatar nombre="calendar-outline" tono={tonoPorTipo[a.tipo] || 'primary'} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.titulo}>{a.titulo}</Text>
                <Text style={styles.mensaje}>{a.mensaje}</Text>
                <Text style={styles.fecha}>{a.fecha}</Text>
              </View>
              <Switch
                value={a.activa}
                onValueChange={() => alternarActiva(a.id)}
                trackColor={{ false: COLORS.silver, true: COLORS.primary }}
                thumbColor={COLORS.white}
                activeThumbColor={COLORS.white}
              />
              <Pressable onPress={() => eliminarAlerta(a.id)} style={styles.botonEliminar}>
                <Image source={ICONS.eliminar} style={styles.iconoEliminar} resizeMode="contain" />
              </Pressable>
            </View>
          ))}

          {alertas.length === 0 && <Text style={styles.vacio}>No tienes alertas programadas</Text>}
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
  botonAgregar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    paddingVertical: 13,
    marginBottom: 16,
  },
  iconoAgregar: {
    width: 18,
    height: 18,
  },
  botonAgregarTexto: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  formulario: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 16,
    ...SHADOW.card,
  },
  formularioEtiqueta: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.dark,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  filaTipos: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  chipTipo: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.silver,
  },
  chipTipoActivo: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipTipoTexto: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.slate,
  },
  chipTipoTextoActivo: {
    color: COLORS.white,
  },
  tarjetaAlerta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 10,
    ...SHADOW.card,
  },
  titulo: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.dark,
  },
  mensaje: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.slate,
  },
  fecha: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.silver,
    marginTop: 2,
  },
  botonEliminar: {
    padding: 4,
  },
  iconoEliminar: {
    width: 18,
    height: 18,
  },
  vacio: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.slate,
    textAlign: 'center',
    marginTop: 40,
  },
});
