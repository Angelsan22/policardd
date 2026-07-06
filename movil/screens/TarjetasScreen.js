/* Zona 1: Importaciones */
import { useState } from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../constants/colors';
import { RADIUS, SHADOW } from '../constants/theme';
import { GradientHero } from '../components/GradientHero';
import { BarraInferior } from '../components/BarraInferior';
import { TarjetaCard } from '../components/TarjetaCard';
import { Input } from '../components/Input';
import { Boton } from '../components/Boton';
import { ICONS } from '../constants/icons';
import { tarjetasMock } from '../data/mock';

const formularioVacio = { alias: '', banco: '', limite: '', saldoUtilizado: '', fechaPago: '' };

/* Zona 2: Componente principal
   Objetivo: registrar, editar y eliminar las tarjetas de credito
   personales del usuario (RF01-RF05, interfaz I-04). */
export default function TarjetasScreen({ pantallaActiva, onCambiarPantalla }) {
  const [tarjetas, setTarjetas] = useState(tarjetasMock);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formularioVacio);

  const actualizarCampo = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const abrirParaAgregar = () => {
    setEditandoId(null);
    setForm(formularioVacio);
    setMostrarForm(true);
  };

  const abrirParaEditar = (tarjeta) => {
    setEditandoId(tarjeta.id);
    setForm({
      alias: tarjeta.alias,
      banco: tarjeta.banco,
      limite: String(tarjeta.limite),
      saldoUtilizado: String(tarjeta.saldoUtilizado),
      fechaPago: tarjeta.fechaPago,
    });
    setMostrarForm(true);
  };

  const cerrarForm = () => {
    setMostrarForm(false);
    setEditandoId(null);
    setForm(formularioVacio);
  };

  const guardarTarjeta = () => {
    if (!form.alias.trim() || !form.banco.trim() || !form.limite.trim()) {
      Alert.alert('Faltan datos', 'Completa nombre, banco y limite de credito');
      return;
    }
    if (editandoId) {
      setTarjetas(tarjetas.map((t) => (
        t.id === editandoId
          ? {
              ...t,
              alias: form.alias,
              banco: form.banco,
              limite: Number(form.limite) || 0,
              saldoUtilizado: Number(form.saldoUtilizado) || 0,
              fechaPago: form.fechaPago || 'Sin definir',
            }
          : t
      )));
    } else {
      setTarjetas([{
        id: Date.now(),
        alias: form.alias,
        banco: form.banco,
        limite: Number(form.limite) || 0,
        saldoUtilizado: Number(form.saldoUtilizado) || 0,
        fechaCorte: '--',
        fechaPago: form.fechaPago || 'Sin definir',
      }, ...tarjetas]);
    }
    cerrarForm();
  };

  const eliminarTarjeta = (id) => {
    Alert.alert('Eliminar tarjeta', 'Se eliminara la tarjeta del perfil', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setTarjetas(tarjetas.filter((t) => t.id !== id)) },
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
              <Input etiqueta="Alias" valor={form.alias} onChangeText={(v) => actualizarCampo('alias', v)} placeholder="Tarjeta Clasica" />
              <Input etiqueta="Banco" valor={form.banco} onChangeText={(v) => actualizarCampo('banco', v)} placeholder="BBVA" />
              <Input etiqueta="Limite de credito" valor={form.limite} onChangeText={(v) => actualizarCampo('limite', v)} placeholder="10000" keyboardType="numeric" />
              <Input etiqueta="Saldo utilizado" valor={form.saldoUtilizado} onChangeText={(v) => actualizarCampo('saldoUtilizado', v)} placeholder="0" keyboardType="numeric" />
              <Input etiqueta="Fecha de pago" valor={form.fechaPago} onChangeText={(v) => actualizarCampo('fechaPago', v)} placeholder="10 jul" />
              <Boton titulo={editandoId ? 'Guardar cambios' : 'Guardar tarjeta'} onPress={guardarTarjeta} />
            </View>
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
  formularioTitulo: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 12,
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
