import { useRouter } from 'expo-router';
import RegistroScreen from '../../screens/RegistroScreen';
import { useAuth } from '../../data/auth';

export default function Registro() {
  const router = useRouter();
  const { login } = useAuth();

  const manejarRegistro = (accessToken, tipo, nombre) => {
    login(accessToken, tipo, nombre);
    router.replace('/(tabs)');
  };

  return (
    <RegistroScreen
      onRegistroExitoso={manejarRegistro}
      onIrALogin={() => router.back()}
    />
  );
}
