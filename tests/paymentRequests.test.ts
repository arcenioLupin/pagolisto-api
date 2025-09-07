import request from 'supertest'
import app from '../src/index'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'pagolistoDev'

describe('💳 Payment Request Endpoints', () => {
  let token: string

  // Generate a simulated token with a dummy merchant ID
  beforeAll(() => {
    const payload = {
      id: '111111111111111111111111',
      email: 'testmerchant@pagolisto.com'
    }
    token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  it('✅ should create a new payment request', async () => {
    const res = await request(app)
      .post('/api/payment-requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        client: 'Juan Pérez',
        amount: 150,
        paymentType: 'Yape',
        description: 'Technical service'
      })

    expect(res.status).toBe(201)
    expect(res.body.data).toHaveProperty('_id')
    expect(res.body.data.client).toBe('Juan Pérez')
  })

  it('✅ should retrieve all payment requests for the merchant', async () => {
    const res = await request(app)
      .get('/api/payment-requests')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })
})
