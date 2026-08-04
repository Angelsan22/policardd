/* Zona 1: Importaciones */
import { useState } from 'react';
import { ScrollView, View, Image, Text, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants/colors';
import { RADIUS, SHADOW } from '../constants/theme';
import { GradientHero } from '../components/GradientHero';
import { Input } from '../components/Input';
import { Boton } from '../components/Boton';

/* Zona 2: Componente principal
   Objetivo: autenticar al usuario registrado contra la API de PoliCard y
   generar su sesion para acceder al Dashboard (RF01-RF05, interfaz I-02). */
export default function LoginScreen({ onLoginExitoso, onIrARegistro }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [recordarSesion, setRecordarSesion] = useState(true);
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async () => {
    if (!correo.trim() || !contrasena.trim()) {
      setError('Ingresa tu correo y contrasena');
      return;
    }
    setError('');
    setCargando(true);
    try {
      const respuesta = await fetch('http://192.168.100.10:10000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'policard-dev-api-key-CHANGE-ME',
        },
        body: JSON.stringify({ email: correo.trim(), password: contrasena }),
      });
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.detail || 'Credenciales invalidas');
        return;
      }

      onLoginExitoso(datos.access_token, datos.tipo, datos.nombre);
    } catch (error) {
      console.log('Error de API', error);
      setError('No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <GradientHero>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.subtitulo}>Tu analisis financiero personal</Text>
        </GradientHero>

        <View style={styles.sheet}>
          <Text style={styles.tituloForm}>Inicia sesion</Text>
          <Input etiqueta="Correo" valor={correo} onChangeText={setCorreo} placeholder="correo@upq.edu.mx" keyboardType="email-address" />
          <Input etiqueta="Contrasena" valor={contrasena} onChangeText={setContrasena} placeholder="********" secureTextEntry error={error} />

          <View style={styles.filaRecordar}>
            <Text style={styles.textoRecordar}>Mantener sesion iniciada</Text>
            <Switch
              value={recordarSesion}
              onValueChange={setRecordarSesion}
              trackColor={{ false: COLORS.silver, true: COLORS.primary }}
              thumbColor={COLORS.white}
              activeThumbColor={COLORS.white}
            />
          </View>

          <Boton titulo={cargando ? 'Iniciando...' : 'Iniciar sesion'} onPress={iniciarSesion} disabled={cargando} />
          <Boton titulo="Crear una cuenta" variante="contorno" onPress={onIrARegistro} />
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
    width: 220,
    height: 146,
    marginLeft: -14,
    marginBottom: -6,
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
    marginTop: -26,
    padding: 24,
    ...SHADOW.lifted,
  },
  tituloForm: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.dark,
    marginBottom: 16,
  },
  filaRecordar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  textoRecordar: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.dark,
  },
});
