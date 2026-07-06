/* Datos de prueba (mock) usados mientras no hay conexion a la API real */

export const usuarioMock = {
  nombre: 'Maria Palma',
  correo: '123045452@upq.edu.mx',
  fotoIniciales: 'MP',
};

export const tarjetasMock = [
  { id: 1, alias: 'Tarjeta Estudiante', banco: 'BBVA', limite: 8000, saldoUtilizado: 5600, fechaCorte: '25', fechaPago: '10 jul' },
  { id: 2, alias: 'Tarjeta Clasica', banco: 'Santander', limite: 15000, saldoUtilizado: 3200, fechaCorte: '18', fechaPago: '03 jul' },
  { id: 3, alias: 'Tarjeta Joven', banco: 'Banorte', limite: 5000, saldoUtilizado: 4750, fechaCorte: '05', fechaPago: '20 jul' },
];

export const analisisMock = {
  fecha: '2026-07-04',
  utilizacionGlobal: 46,
  nivelEndeudamiento: 'Medio',
  riesgoFinanciero: 'Medio',
  recomendaciones: [
    'Reduce el saldo de tu Tarjeta Joven, esta al 95% de su limite.',
    'Paga antes de la fecha de corte para evitar intereses.',
    'Evita solicitar una tarjeta nueva hasta bajar tu endeudamiento global.',
  ],
};

export const alertasMock = [
  { id: 1, titulo: 'Pago Tarjeta Estudiante', mensaje: 'Vence el 10 de julio', tipo: 'pago', fecha: '2026-07-10', activa: true },
  { id: 2, titulo: 'Fecha de corte Banorte', mensaje: 'Corte el dia 05', tipo: 'corte', fecha: '2026-07-05', activa: true },
  { id: 3, titulo: 'Riesgo alto detectado', mensaje: 'Tarjeta Joven supera el 90% de uso', tipo: 'riesgo', fecha: '2026-07-01', activa: true },
];

export const tarjetasSugeridasMock = [
  { id: 'sug-1', nombre: 'Tarjeta Basica Sin Anualidad', banco: 'Nu', cat: 38.5, anualidad: 0, motivo: 'CAT mas bajo que tus tarjetas actuales' },
  { id: 'sug-2', nombre: 'Tarjeta Universitaria', banco: 'BBVA', cat: 42.0, anualidad: 0, motivo: 'Pensada para reemplazar tu Tarjeta Joven' },
];

export const historialMock = [
  { id: 1, fecha: '2026-07-04', utilizacionGlobal: 46, riesgoFinanciero: 'Medio' },
  { id: 2, fecha: '2026-06-04', utilizacionGlobal: 52, riesgoFinanciero: 'Medio' },
  { id: 3, fecha: '2026-05-04', utilizacionGlobal: 61, riesgoFinanciero: 'Alto' },
  { id: 4, fecha: '2026-04-04', utilizacionGlobal: 39, riesgoFinanciero: 'Bajo' },
];
