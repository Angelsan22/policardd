import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../data/auth';

export default function AuthLayout() {
  const { sesion } = useAuth();
  if (sesion) {
    return <Redirect href="/(tabs)" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
