import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '../../data/auth';
import { BarraInferior } from '../../components/BarraInferior';

export default function TabsLayout() {
  const { sesion } = useAuth();
  if (!sesion) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BarraInferior {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="tarjetas" options={{ title: 'Tarjetas' }} />
      <Tabs.Screen name="analizador" options={{ title: 'Analisis' }} />
      <Tabs.Screen name="alertas" options={{ title: 'Alertas' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
