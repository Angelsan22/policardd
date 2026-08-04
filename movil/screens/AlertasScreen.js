/* Zona 1: Importaciones */
import { useCallback, useState } from 'react';
import { ScrollView, View, Text, Image, Switch, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { COLORS, FONTS } from '../constants/colors';
import { RADIUS, SHADOW } from '../constants/theme';
import { GradientHero } from '../components/GradientHero';
import { IconAvatar } from '../components/IconAvatar';
import { Input } from '../components/Input';
import { Boton } from '../components/Boton';
import { ICONS } from '../constants/icons';
import { useAuth } from '../data/auth';

const API_KEY_HEADER = 'policard-dev-api-key-CHANGE-ME';
const imagenPorTipo = { pago: ICONS.pago, riesgo: ICONS.riesgo };
const tonoPorTipo = { pago: 'primary', corte: 'dark', riesgo: 'slate' };
const TIPOS = [
  { clave: 'pago', etiqueta: 'Pago' },
  { clave: 'corte', etiqueta: 'Corte' },
  { clave: 'riesgo', etiqueta: 'Riesgo' },
];

/* Zona 2: Componente principal
   Objetivo: programar, listar y cancelar recordatorios de fechas de
   pago, corte o de riesgo financiero alto contra la API real
   (RF01, RF03, RF04, RF05, interfaz I-06). Las notificaciones push
   (RF02) quedan pendientes para una siguiente iteracion. */
export default function AlertasScreen() {
  const { sesion } = useAuth();
  const [alertas, setAlertas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [fecha, setFecha] = useState('');
  const [tipo, setTipo] = useState('pago');
  const [errorFecha, setErrorFecha] = useState('');

  const validarFecha = (valor) => /^\d{4}-\d{2}-\d{2}$/.test(valor);

  const encabezados = {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY_HEADER,
    Authorization: `Bearer ${sesion?.accessToken}`,
  };

  const cargarAlertas = async () => {
    try {
      const respuesta = await fetch('http://192.168.100.10:10000/api/v1/cliente/alertas', {
        headers: encabezados,
      });
      const datos = await respuesta.json();
      console.log('Respuesta API alertas:', datos);
      setAlertas(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.log('Error de API', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarAlertas();
    }, [])
  );

  const alternarActiva = async (alerta) => {
    setAlertas((prev) => prev.map((a) => (a.id === alerta.id ? { ...a, activa: !a.activa } : a)));
    try {
      await fetch(`http://192.168.100.10:10000/api/v1/cliente/alertas/${alerta.id}`, {
        method: 'PATCH',
        headers: encabezados,
        body: JSON.stringify({ activa: !alerta.activa }),
      });
    } catch (error) {
      console.log('Error de API', error);
    }
  };

  const eliminarAlerta = async (id) => {
    setAlertas((prev) => prev.filter((a) => a.id !== id));
    try {
      await fetch(`http://192.168.100.10:10000/api/v1/cliente/alertas/${id}`, {
        method: 'DELETE',
        headers: encabezados,
      });
    } catch (error) {
      console.log('Error de API', error);
    }
  };

  const crearAlerta = async () => {
    if (!titulo.trim() || !fecha.trim()) {
      Alert.alert('Faltan datos', 'Ingresa al menos el titulo y la fecha del recordatorio');
      return;
    }
    if (!validarFecha(fecha.trim())) {
      setErrorFecha('Formato AAAA-MM-DD, ej. 2026-07-15');
      return;
    }
    setErrorFecha('');
    try {
      const respuesta = await fetch('http://192.168.100.10:10000/api/v1/cliente/alertas', {
        method: 'POST',
        headers: encabezados,
        body: JSON.stringify({ titulo, mensaje, fecha, tipo }),
      });
      if (!respuesta.ok) {
        const datos = await respuesta.json();
        Alert.alert('No se pudo crear la alerta', datos.detail || 'Intenta de nuevo');
        return;
      }
      setTitulo(''); setMensaje(''); setFecha(''); setTipo('pago'); setErrorFecha('');
      setMostrarForm(false);
      cargarAlertas();
    } catch (error) {
      console.log('Error de API', error);
      Alert.alert('Error de conexion', 'No se pudo conectar con el servidor');
    }
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
              <Input etiqueta="Fecha" valor={fecha} onChangeText={setFecha} placeholder="2026-07-15" error={errorFecha} />
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
                onValueChange={() => alternarActiva(a)}
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
