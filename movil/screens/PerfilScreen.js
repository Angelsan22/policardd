/* Zona 1: Importaciones */
import { useState } from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../constants/colors';
import { RADIUS, SHADOW } from '../constants/theme';
import { GradientHero } from '../components/GradientHero';
import { BarraInferior } from '../components/BarraInferior';
import { Input } from '../components/Input';
import { Boton } from '../components/Boton';
import { ICONS } from '../constants/icons';
import { usuarioMock } from '../data/mock';

const COLORES_AVATAR = [COLORS.primary, COLORS.dark, COLORS.slate];

/* Zona 2: Componente principal
   Objetivo: visualizar y actualizar los datos personales del usuario,
   y permitir cerrar sesion (RF01-RF05, interfaz I-08). */
export default function PerfilScreen({ pantallaActiva, onCambiarPantalla, onCerrarSesion }) {
  const [nombre, setNombre] = useState(usuarioMock.nombre);
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [colorAvatar, setColorAvatar] = useState(COLORS.primary);
  const [mostrarColores, setMostrarColores] = useState(false);

  const guardarCambios = () => {
    if (contrasenaNueva && !contrasenaActual) {
      Alert.alert('Falta informacion', 'Ingresa tu contrasena actual para cambiarla');
      return;
    }
    Alert.alert('Perfil actualizado', 'Tus datos se guardaron correctamente');
    setContrasenaActual('');
    setContrasenaNueva('');
  };

  const eliminarCuenta = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Esta accion es permanente y borrara tus tarjetas, alertas e historial. ¿Deseas continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar cuenta', style: 'destructive', onPress: () => Alert.alert('Solicitud enviada', 'Tu baja de cuenta quedo registrada') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <GradientHero eyebrow="Mi cuenta" title="Perfil" />

        <View style={styles.sheet}>
          <View style={styles.avatarWrap}>
            <View style={[styles.avatar, { backgroundColor: colorAvatar }]}>
              <Text style={styles.avatarTexto}>{usuarioMock.fotoIniciales}</Text>
            </View>
            <Pressable style={styles.botonEditarFoto} onPress={() => setMostrarColores(!mostrarColores)}>
              <Ionicons name="camera-outline" size={14} color={COLORS.white} />
            </Pressable>
          </View>
          <Text style={styles.correo}>{usuarioMock.correo}</Text>

          {mostrarColores && (
            <View style={styles.filaColores}>
              {COLORES_AVATAR.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => { setColorAvatar(c); setMostrarColores(false); }}
                  style={[styles.swatch, { backgroundColor: c }, c === colorAvatar && styles.swatchActivo]}
                />
              ))}
            </View>
          )}

          <Input etiqueta="Nombre" valor={nombre} onChangeText={setNombre} placeholder="Tu nombre" />
          <Input etiqueta="Contrasena actual" valor={contrasenaActual} onChangeText={setContrasenaActual} placeholder="********" secureTextEntry />
          <Input etiqueta="Nueva contrasena" valor={contrasenaNueva} onChangeText={setContrasenaNueva} placeholder="********" secureTextEntry />

          <Boton titulo="Guardar cambios" onPress={guardarCambios} />
          <Boton titulo="Cerrar sesion" variante="contorno" onPress={onCerrarSesion} />

          <Pressable onPress={eliminarCuenta} style={styles.enlaceEliminarCuenta}>
            <Image source={ICONS.eliminar} style={styles.iconoEliminarCuenta} resizeMode="contain" />
            <Text style={styles.enlaceEliminarCuentaTexto}>Eliminar mi cuenta</Text>
          </Pressable>
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
  sheet: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    marginHorizontal: 20,
    marginTop: -30,
    padding: 24,
    paddingTop: 0,
    alignItems: 'center',
    ...SHADOW.lifted,
  },
  avatarWrap: {
    marginTop: -34,
    marginBottom: 10,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  avatarTexto: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 22,
  },
  botonEditarFoto: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.dark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  correo: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.slate,
    marginBottom: 16,
  },
  filaColores: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  swatchActivo: {
    borderWidth: 2,
    borderColor: COLORS.dark,
  },
  enlaceEliminarCuenta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingVertical: 6,
  },
  enlaceEliminarCuentaTexto: {
    color: COLORS.slate,
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
  iconoEliminarCuenta: {
    width: 14,
    height: 14,
  },
});
