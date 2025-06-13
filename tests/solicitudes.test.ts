import request from 'supertest'
import app from '../src/index'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

// Usa la misma clave que en tu .env o authController
const JWT_SECRET = process.env.JWT_SECRET || 'pagolistoDev'

describe('💳 Endpoints de Solicitudes de Pago', () => {
  let token: string

  // Generamos un token simulado con un ID de comercio ficticio
  beforeAll(() => {
    const payload = {
      id: '111111111111111111111111',
      email: 'testcomercio@pagolisto.com'
    }
    token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  it('✅ debería crear una nueva solicitud de pago', async () => {
    const res = await request(app)
      .post('/api/solicitudes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cliente: 'Juan Pérez',
        monto: 150,
        tipoPago: 'Yape',
        descripcion: 'Servicio técnico'
      })

    expect(res.status).toBe(201)
    //console.log('res.body: ',res.body)
    expect(res.body.data).toHaveProperty('_id')
    expect(res.body.data.cliente).toBe('Juan Pérez')
  })

  it('✅ debería obtener todas las solicitudes del comercio', async () => {
    const res = await request(app)
      .get('/api/solicitudes')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
