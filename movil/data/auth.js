/* Sesion del usuario: token/tipo/nombre en memoria (igual de simple que el
   useState de sesion que antes vivia en App.js, sin libreria de persistencia) */
import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(null);

  const valor = useMemo(() => ({
    sesion,
    login: (accessToken, tipo, nombre) => setSesion({ accessToken, tipo, nombre }),
    logout: () => setSesion(null),
  }), [sesion]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
