/* Zona 1: Importaciones */
import { useState } from 'react';
import { ScrollView, View, Image, Text, Switch, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants/colors';
import { RADIUS, SHADOW } from '../constants/theme';
import { GradientHero } from '../components/GradientHero';
import { Input } from '../components/Input';
import { Boton } from '../components/Boton';

/* Zona 2: Componente principal
   Objetivo: autenticar al usuario registrado y generar su sesion
   para acceder al Dashboard (RF01-RF05, interfaz I-02). */
export default function LoginScreen({ onLoginExitoso, onIrARegistro }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [recordarSesion, setRecordarSesion] = useState(true);

  const iniciarSesion = () => {
    if (!correo.trim() || !contrasena.trim()) {
      setError('Ingresa tu correo y contrasena');
      return;
    }
    setError('');
    Alert.alert(
      'Sesion iniciada',
      recordarSesion
        ? 'Token de sesion generado. Se mantendra activa en este dispositivo.'
        : 'Token de sesion generado para esta sesion unicamente.'
    );
    onLoginExitoso();
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

          <Boton titulo="Iniciar sesion" onPress={iniciarSesion} />
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
