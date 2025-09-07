import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import authRoutes from './routes/authRoutes'
import chargeRoutes from './routes/chargeRoutes'
import merchantConfigRoutes from './routes/merchantConfigRoutes'
import paymentRequestRoutes from './routes/paymentRequestRoutes'
import dashboardRoutes from './routes/dashboardRoutes'

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 3000
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'

app.use(cors({
  origin: allowedOrigin, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(helmet())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/charges', chargeRoutes)
app.use('/api/config', merchantConfigRoutes)
app.use('/api/payment-requests', paymentRequestRoutes)
app.use('/api/dashboard', dashboardRoutes)


app.get('/', (req, res) => {
  res.send('Pagolisto API running')
})

export default app

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`)
  })
}
