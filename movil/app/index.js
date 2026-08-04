/* Punto de entrada: manda a tabs si hay sesion, o a login si no la hay
   (mismo patron que PM204/usuarioApi/usuarioApi/app/(tabs)/index.js) */
import { Redirect } from 'expo-router';
import { useAuth } from '../data/auth';

export default function Index() {
  const { sesion } = useAuth();
  return <Redirect href={sesion ? '/(tabs)' : '/(auth)/login'} />;
}
