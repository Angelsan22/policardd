/* Zona 1: Importaciones */
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';

import { COLORS } from './constants/colors';
import RegistroScreen from './screens/RegistroScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import TarjetasScreen from './screens/TarjetasScreen';
import AnalizadorScreen from './screens/AnalizadorScreen';
import AlertasScreen from './screens/AlertasScreen';
import HistorialScreen from './screens/HistorialScreen';
import PerfilScreen from './screens/PerfilScreen';

/* Zona 2: Componente principal
   Navegacion manual por estado (sin libreria de navegacion), igual que
   en las practicas del curso: un switch decide que pantalla se muestra. */
export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    DMSerifDisplay_400Regular,
  });

  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [pantallaAuth, setPantallaAuth] = useState('login');
  const [pantallaActiva, setPantallaActiva] = useState('dashboard');
  const [pantallaAnterior, setPantallaAnterior] = useState('dashboard');

  if (!fontsLoaded) {
    return null;
  }

  const irAPantalla = (destino) => {
    setPantallaAnterior(pantallaActiva);
    setPantallaActiva(destino);
  };

  const cerrarSesion = () => {
    setSesionIniciada(false);
    setPantallaAuth('login');
    setPantallaActiva('dashboard');
  };

  if (!sesionIniciada) {
    return (
      <SafeAreaProvider>
        <View style={styles.raiz}>
          {pantallaAuth === 'login' ? (
            <LoginScreen
              onLoginExitoso={() => setSesionIniciada(true)}
              onIrARegistro={() => setPantallaAuth('registro')}
            />
          ) : (
            <RegistroScreen
              onRegistroExitoso={() => setSesionIniciada(true)}
              onIrALogin={() => setPantallaAuth('login')}
            />
          )}
          <StatusBar style="light" />
        </View>
      </SafeAreaProvider>
    );
  }

  let pantalla;
  switch (pantallaActiva) {
    case 'tarjetas':
      pantalla = <TarjetasScreen pantallaActiva={pantallaActiva} onCambiarPantalla={irAPantalla} />;
      break;
    case 'analizador':
      pantalla = <AnalizadorScreen pantallaActiva={pantallaActiva} onCambiarPantalla={irAPantalla} />;
      break;
    case 'alertas':
      pantalla = <AlertasScreen pantallaActiva={pantallaActiva} onCambiarPantalla={irAPantalla} />;
      break;
    case 'historial':
      pantalla = (
        <HistorialScreen
          pantallaActiva={pantallaActiva}
          onCambiarPantalla={irAPantalla}
          onRegresar={() => setPantallaActiva(pantallaAnterior)}
        />
      );
      break;
    case 'perfil':
      pantalla = <PerfilScreen pantallaActiva={pantallaActiva} onCambiarPantalla={irAPantalla} onCerrarSesion={cerrarSesion} />;
      break;
    case 'dashboard':
    default:
      pantalla = <DashboardScreen pantallaActiva={pantallaActiva} onCambiarPantalla={irAPantalla} />;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.raiz}>
        {pantalla}
        <StatusBar style="dark" />
      </View>
    </SafeAreaProvider>
  );
}

/* Zona 3: Estilos */
const styles = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
