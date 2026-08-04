/* Zona 1: Importaciones */
import { useCallback, useState } from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS } from '../constants/colors';
import { RADIUS, SHADOW } from '../constants/theme';
import { GradientHero } from '../components/GradientHero';
import { Input } from '../components/Input';
import { Boton } from '../components/Boton';
import { ICONS } from '../constants/icons';
import { useAuth } from '../data/auth';

const API_KEY_HEADER = 'policard-dev-api-key-CHANGE-ME';
const HOST = 'http://192.168.100.10:10000';

/* Zona 2: Componente principal
   Objetivo: visualizar y actualizar los datos reales del cliente
   (nombre, contrasena, foto de perfil) y permitir cerrar sesion o dar
   de baja la cuenta contra la API real (RF01-RF05, interfaz I-08). */
export default function PerfilScreen() {
  const { sesion, logout } = useAuth();
  const router = useRouter();

  const [usuario, setUsuario] = useState({ nombre: sesion?.nombre || '', email: '', fotoUrl: null });
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [errores, setErrores] = useState({});

  const encabezados = {
    'X-API-Key': API_KEY_HEADER,
    Authorization: `Bearer ${sesion?.accessToken}`,
  };

  const cargarPerfil = async () => {
    try {
      const respuesta = await fetch(`${HOST}/api/v1/cliente/me`, { headers: encabezados });
      const datos = await respuesta.json();
      console.log('Respuesta API cliente/me:', datos);
      if (respuesta.ok) {
        setUsuario({ nombre: datos.nombre, email: datos.email, fotoUrl: datos.foto_url });
      }
    } catch (error) {
      console.log('Error de API', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarPerfil();
    }, [])
  );

  const iniciales = usuario.nombre
    ? usuario.nombre.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
    : '';

  const guardarCambios = async () => {
    const nuevosErrores = {};
    if (!usuario.nombre.trim() || usuario.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    if (contrasenaNueva && !contrasenaActual) {
      nuevosErrores.contrasenaActual = 'Ingresa tu contrasena actual para cambiarla';
    }
    if (contrasenaNueva && contrasenaNueva.length < 6) {
      nuevosErrores.contrasenaNueva = 'Minimo 6 caracteres';
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    setGuardando(true);
    try {
      const respuesta = await fetch(`${HOST}/api/v1/cliente/me`, {
        method: 'PATCH',
        headers: { ...encabezados, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: usuario.nombre,
          password_actual: contrasenaActual || null,
          password_nueva: contrasenaNueva || null,
        }),
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) {
        Alert.alert('No se pudo actualizar', datos.detail || 'Intenta de nuevo');
        return;
      }
      Alert.alert('Perfil actualizado', 'Tus datos se guardaron correctamente');
      setContrasenaActual('');
      setContrasenaNueva('');
      setErrores({});
    } catch (error) {
      console.log('Error de API', error);
      Alert.alert('Error de conexion', 'No se pudo conectar con el servidor');
    } finally {
      setGuardando(false);
    }
  };

  const cambiarFoto = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a tus fotos para cambiar tu foto de perfil');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (resultado.canceled) {
      return;
    }

    const foto = resultado.assets[0];
    const formData = new FormData();
    formData.append('foto', {
      uri: foto.uri,
      name: foto.fileName || 'perfil.jpg',
      type: foto.mimeType || 'image/jpeg',
    });

    setSubiendoFoto(true);
    try {
      const respuesta = await fetch(`${HOST}/api/v1/cliente/me/foto`, {
        method: 'POST',
        headers: encabezados,
        body: formData,
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) {
        Alert.alert('No se pudo subir la foto', datos.detail || 'Intenta de nuevo');
        return;
      }
      setUsuario((u) => ({ ...u, fotoUrl: datos.foto_url }));
    } catch (error) {
      console.log('Error de API', error);
      Alert.alert('Error de conexion', 'No se pudo conectar con el servidor');
    } finally {
      setSubiendoFoto(false);
    }
  };

  const cerrarSesion = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const eliminarCuenta = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Esta accion es permanente y borrara tus tarjetas, alertas e historial. ¿Deseas continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar cuenta',
          style: 'destructive',
          onPress: async () => {
            try {
              await fetch(`${HOST}/api/v1/cliente/baja`, { method: 'POST', headers: encabezados });
            } catch (error) {
              console.log('Error de API', error);
            }
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <GradientHero eyebrow="Mi cuenta" title="Perfil" />

        <View style={styles.sheet}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              {usuario.fotoUrl ? (
                <Image source={{ uri: `${HOST}${usuario.fotoUrl}` }} style={styles.avatarFoto} />
              ) : (
                <Text style={styles.avatarTexto}>{iniciales}</Text>
              )}
            </View>
            <Pressable style={styles.botonEditarFoto} onPress={cambiarFoto} disabled={subiendoFoto}>
              <Ionicons name="camera-outline" size={14} color={COLORS.white} />
            </Pressable>
          </View>
          <Text style={styles.correo}>{usuario.email}</Text>

          <Input etiqueta="Nombre" valor={usuario.nombre} onChangeText={(v) => setUsuario((u) => ({ ...u, nombre: v }))} placeholder="Tu nombre" error={errores.nombre} />
          <Input etiqueta="Contrasena actual" valor={contrasenaActual} onChangeText={setContrasenaActual} placeholder="********" secureTextEntry error={errores.contrasenaActual} />
          <Input etiqueta="Nueva contrasena" valor={contrasenaNueva} onChangeText={setContrasenaNueva} placeholder="********" secureTextEntry error={errores.contrasenaNueva} />

          <Boton titulo={guardando ? 'Guardando...' : 'Guardar cambios'} onPress={guardarCambios} disabled={guardando} />
          <Boton titulo="Cerrar sesion" variante="contorno" onPress={cerrarSesion} />

          <Pressable onPress={eliminarCuenta} style={styles.enlaceEliminarCuenta}>
            <Image source={ICONS.eliminar} style={styles.iconoEliminarCuenta} resizeMode="contain" />
            <Text style={styles.enlaceEliminarCuentaTexto}>Eliminar mi cuenta</Text>
          </Pressable>
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
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
  },
  avatarFoto: {
    width: '100%',
    height: '100%',
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
