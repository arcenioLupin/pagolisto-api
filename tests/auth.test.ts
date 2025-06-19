import request from 'supertest'
import app from '../src/index'
import mongoose from 'mongoose'

describe('🛡️ Authentication Endpoints', () => {
  const email = `testuser_${Date.now()}@mail.com`
  const password = 'TestPass123'
  const businessName = 'Test Company'

  it('✅ should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email,
      password,
      businessName
    })

    expect(res.status).toBe(201)
    expect(res.body.message).toMatch(/registered/i)
  })

  it('✅ should allow login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email,
      password
    })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.email).toBe(email)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })
})
