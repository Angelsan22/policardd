import { useRouter } from 'expo-router';
import LoginScreen from '../../screens/LoginScreen';
import { useAuth } from '../../data/auth';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const manejarLogin = (accessToken, tipo, nombre) => {
    login(accessToken, tipo, nombre);
    router.replace('/(tabs)');
  };

  return (
    <LoginScreen
      onLoginExitoso={manejarLogin}
      onIrARegistro={() => router.push('/(auth)/registro')}
    />
  );
}
