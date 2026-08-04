/* Zona 1: Importaciones */
import { useCallback, useState } from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { COLORS, FONTS } from '../constants/colors';
import { RADIUS, SHADOW } from '../constants/theme';
import { GradientHero } from '../components/GradientHero';
import { TarjetaCard } from '../components/TarjetaCard';
import { Input } from '../components/Input';
import { Boton } from '../components/Boton';
import { ICONS } from '../constants/icons';
import { useAuth } from '../data/auth';

const API_KEY_HEADER = 'policard-dev-api-key-CHANGE-ME';
const formularioVacio = { alias: '', banco: '', limite: '', saldoUtilizado: '', fechaPago: '' };

const mapearTarjeta = (t) => ({
  id: t.id,
  alias: t.alias,
  banco: t.banco,
  limite: t.limite,
  saldoUtilizado: t.saldo_utilizado,
  fechaCorte: t.fecha_corte,
  fechaPago: t.fecha_pago,
});

/* Zona 2: Componente principal
   Objetivo: registrar, editar y eliminar las tarjetas de credito
   personales del usuario contra la API real (RF01-RF05, interfaz I-04). */
export default function TarjetasScreen() {
  const { sesion } = useAuth();
  const [tarjetas, setTarjetas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [editandoFechaCorte, setEditandoFechaCorte] = useState(null);
  const [form, setForm] = useState(formularioVacio);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const encabezados = {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY_HEADER,
    Authorization: `Bearer ${sesion?.accessToken}`,
  };

  const cargarTarjetas = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch('http://192.168.100.10:10000/api/v1/cliente/tarjetas-personales', {
        headers: encabezados,
      });
      const datos = await respuesta.json();
      console.log('Respuesta API tarjetas-personales:', datos);
      setTarjetas(Array.isArray(datos) ? datos.map(mapearTarjeta) : []);
    } catch (error) {
      console.log('Error de API', error);
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarTarjetas();
    }, [])
  );

  const actualizarCampo = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const abrirParaAgregar = () => {
    setEditandoId(null);
    setEditandoFechaCorte(null);
    setForm(formularioVacio);
    setErrores({});
    setMostrarForm(true);
  };

  const abrirParaEditar = (tarjeta) => {
    setEditandoId(tarjeta.id);
    setEditandoFechaCorte(tarjeta.fechaCorte);
    setForm({
      alias: tarjeta.alias,
      banco: tarjeta.banco,
      limite: String(tarjeta.limite),
      saldoUtilizado: String(tarjeta.saldoUtilizado),
      fechaPago: tarjeta.fechaPago || '',
    });
    setErrores({});
    setMostrarForm(true);
  };

  const cerrarForm = () => {
    setMostrarForm(false);
    setEditandoId(null);
    setEditandoFechaCorte(null);
    setForm(formularioVacio);
    setErrores({});
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    const limiteNum = Number(form.limite);
    const saldoNum = Number(form.saldoUtilizado || '0');

    if (!form.alias.trim()) nuevosErrores.alias = 'Ingresa un alias';
    if (!form.banco.trim()) nuevosErrores.banco = 'Ingresa el banco';
    if (!form.limite.trim() || Number.isNaN(limiteNum) || limiteNum <= 0) {
      nuevosErrores.limite = 'Ingresa un limite valido mayor a 0';
    }
    if (form.saldoUtilizado.trim() && Number.isNaN(saldoNum)) {
      nuevosErrores.saldoUtilizado = 'Ingresa un saldo valido';
    } else if (!Number.isNaN(limiteNum) && limiteNum > 0 && saldoNum > limiteNum) {
      nuevosErrores.saldoUtilizado = 'El saldo no puede superar el limite';
    } else if (saldoNum < 0) {
      nuevosErrores.saldoUtilizado = 'El saldo no puede ser negativo';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardarTarjeta = async () => {
    if (!validarFormulario()) {
      return;
    }

    const cuerpo = {
      alias: form.alias,
      banco: form.banco,
      limite: Number(form.limite) || 0,
      saldo_utilizado: Number(form.saldoUtilizado) || 0,
      fecha_corte: editandoId ? editandoFechaCorte || '--' : '--',
      fecha_pago: form.fechaPago || 'Sin definir',
    };

    try {
      const url = editandoId
        ? `http://192.168.100.10:10000/api/v1/cliente/tarjetas-personales/${editandoId}`
        : 'http://192.168.100.10:10000/api/v1/cliente/tarjetas-personales';

      const respuesta = await fetch(url, {
        method: editandoId ? 'PUT' : 'POST',
        headers: encabezados,
        body: JSON.stringify(cuerpo),
      });
      if (!respuesta.ok) {
        const datos = await respuesta.json();
        Alert.alert('No se pudo guardar', datos.detail || 'Intenta de nuevo');
        return;
      }
      cerrarForm();
      cargarTarjetas();
    } catch (error) {
      console.log('Error de API', error);
      Alert.alert('Error de conexion', 'No se pudo conectar con el servidor');
    }
  };

  const eliminarTarjeta = (id) => {
    Alert.alert('Eliminar tarjeta', 'Se eliminara la tarjeta del perfil', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await fetch(`http://192.168.100.10:10000/api/v1/cliente/tarjetas-personales/${id}`, {
              method: 'DELETE',
              headers: encabezados,
            });
            cargarTarjetas();
          } catch (error) {
            console.log('Error de API', error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <GradientHero eyebrow="Mi cartera" title="Mis tarjetas" compact />

        <View style={styles.body}>
          <Pressable style={styles.botonAgregar} onPress={mostrarForm ? cerrarForm : abrirParaAgregar}>
            {mostrarForm ? (
              <Ionicons name="close" size={18} color={COLORS.primary} />
            ) : (
              <Image source={ICONS.agregar} style={styles.iconoAgregar} resizeMode="contain" />
            )}
            <Text style={styles.botonAgregarTexto}>{mostrarForm ? 'Cancelar' : 'Agregar tarjeta'}</Text>
          </Pressable>

          {mostrarForm && (
            <View style={styles.formulario}>
              <Text style={styles.formularioTitulo}>{editandoId ? 'Editar tarjeta' : 'Nueva tarjeta'}</Text>
              <Input etiqueta="Alias" valor={form.alias} onChangeText={(v) => actualizarCampo('alias', v)} placeholder="Tarjeta Clasica" error={errores.alias} />
              <Input etiqueta="Banco" valor={form.banco} onChangeText={(v) => actualizarCampo('banco', v)} placeholder="BBVA" error={errores.banco} />
              <Input etiqueta="Limite de credito" valor={form.limite} onChangeText={(v) => actualizarCampo('limite', v)} placeholder="10000" keyboardType="numeric" error={errores.limite} />
              <Input etiqueta="Saldo utilizado" valor={form.saldoUtilizado} onChangeText={(v) => actualizarCampo('saldoUtilizado', v)} placeholder="0" keyboardType="numeric" error={errores.saldoUtilizado} />
              <Input etiqueta="Fecha de pago" valor={form.fechaPago} onChangeText={(v) => actualizarCampo('fechaPago', v)} placeholder="10 jul" />
              <Boton titulo={editandoId ? 'Guardar cambios' : 'Guardar tarjeta'} onPress={guardarTarjeta} />
            </View>
          )}

          {!cargando && tarjetas.length === 0 && !mostrarForm && (
            <Text style={styles.vacio}>Aun no tienes tarjetas registradas</Text>
          )}

          {tarjetas.map((t) => (
            <View key={t.id}>
              <TarjetaCard alias={t.alias} banco={t.banco} limite={t.limite} saldoUtilizado={t.saldoUtilizado} fechaPago={t.fechaPago} />
              <View style={styles.filaAcciones}>
                <Pressable style={styles.enlaceAccion} onPress={() => abrirParaEditar(t)}>
                  <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.enlaceEditarTexto}>Editar</Text>
                </Pressable>
                <Pressable style={styles.enlaceAccion} onPress={() => eliminarTarjeta(t.id)}>
                  <Image source={ICONS.eliminar} style={styles.iconoEliminar} resizeMode="contain" />
                  <Text style={styles.enlaceEliminarTexto}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          ))}
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
  formularioTitulo: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 12,
  },
  vacio: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.slate,
    textAlign: 'center',
    marginTop: 40,
  },
  filaAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: -4,
    marginBottom: 8,
  },
  enlaceAccion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  enlaceEditarTexto: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
  enlaceEliminarTexto: {
    color: COLORS.slate,
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
  iconoEliminar: {
    width: 16,
    height: 16,
  },
});
