export const logActividad = (mensaje: string, data?: any) => {
  const timestamp = new Date().toISOString()
  console.log(`[📝 ${timestamp}] ${mensaje}`)
  if (data) console.log(`📦 Datos:`, data)
}
