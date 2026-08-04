/* Zona 1: Importaciones */
import { useState } from 'react';
import { ScrollView, View, Image, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants/colors';
import { RADIUS, SHADOW } from '../constants/theme';
import { GradientHero } from '../components/GradientHero';
import { Input } from '../components/Input';
import { Boton } from '../components/Boton';

/* Zona 2: Componente principal
   Objetivo: permitir que un usuario nuevo cree su cuenta en PoliCard Smart
   contra la API real, capturando los datos que pide el backend
   (RF01-RF05, interfaz I-01). */
export default function RegistroScreen({ onRegistroExitoso, onIrALogin }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [direccion, setDireccion] = useState('');
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const validarCorreo = (valor) => /\S+@\S+\.\S+/.test(valor);
  const validarFecha = (valor) => /^\d{4}-\d{2}-\d{2}$/.test(valor);

  const registrar = async () => {
    const nuevosErrores = {};
    if (!nombre.trim()) nuevosErrores.nombre = 'Ingresa tu nombre completo';
    if (!validarCorreo(correo)) nuevosErrores.correo = 'Ingresa un correo valido';
    if (contrasena.length < 6) nuevosErrores.contrasena = 'Minimo 6 caracteres';
    if (confirmacion !== contrasena) nuevosErrores.confirmacion = 'Las contrasenas no coinciden';
    if (!telefono.trim()) nuevosErrores.telefono = 'Ingresa tu telefono';
    if (!validarFecha(fechaNacimiento)) nuevosErrores.fechaNacimiento = 'Formato AAAA-MM-DD';
    if (!direccion.trim()) nuevosErrores.direccion = 'Ingresa tu direccion';

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    setCargando(true);
    try {
      const respuesta = await fetch('http://192.168.100.10:10000/api/v1/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'policard-dev-api-key-CHANGE-ME',
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: correo.trim(),
          password: contrasena,
          telefono: telefono.trim(),
          fecha_nacimiento: fechaNacimiento.trim(),
          direccion: direccion.trim(),
        }),
      });
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        Alert.alert('No se pudo registrar', datos.detail || 'Intenta de nuevo');
        return;
      }

      onRegistroExitoso(datos.access_token, datos.tipo, datos.nombre);
    } catch (error) {
      console.log('Error de API', error);
      Alert.alert('Error de conexion', 'No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <GradientHero compact>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.marca}>Crear cuenta</Text>
          <Text style={styles.subtitulo}>Registrate para analizar tus tarjetas de credito</Text>
        </GradientHero>

        <View style={styles.sheet}>
          <Input etiqueta="Nombre completo" valor={nombre} onChangeText={setNombre} placeholder="Maria Palma" error={errores.nombre} />
          <Input etiqueta="Correo" valor={correo} onChangeText={setCorreo} placeholder="correo@upq.edu.mx" keyboardType="email-address" error={errores.correo} />
          <Input etiqueta="Contrasena" valor={contrasena} onChangeText={setContrasena} placeholder="********" secureTextEntry error={errores.contrasena} />
          <Input etiqueta="Confirmar contrasena" valor={confirmacion} onChangeText={setConfirmacion} placeholder="********" secureTextEntry error={errores.confirmacion} />
          <Input etiqueta="Telefono" valor={telefono} onChangeText={setTelefono} placeholder="4421234567" keyboardType="phone-pad" error={errores.telefono} />
          <Input etiqueta="Fecha de nacimiento" valor={fechaNacimiento} onChangeText={setFechaNacimiento} placeholder="2005-04-12" error={errores.fechaNacimiento} />
          <Input etiqueta="Direccion" valor={direccion} onChangeText={setDireccion} placeholder="Calle y numero, ciudad" error={errores.direccion} />

          <Boton titulo={cargando ? 'Creando cuenta...' : 'Registrarme'} onPress={registrar} disabled={cargando} />
          <Boton titulo="Ya tengo cuenta" variante="contorno" onPress={onIrALogin} />
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
  logo: {
    width: 130,
    height: 87,
    marginLeft: -10,
    marginBottom: -4,
  },
  marca: {
    fontFamily: FONTS.display,
    fontSize: 24,
    color: COLORS.white,
  },
  subtitulo: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    marginHorizontal: 20,
    marginTop: -22,
    padding: 24,
    ...SHADOW.lifted,
  },
});
