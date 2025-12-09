import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express'
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

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.use(helmet())

// ⬇⬇ Body parsers con límite aumentado
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true, limit: '5mb' }))
// ⬆⬆

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/charges', chargeRoutes)
app.use('/api/config', merchantConfigRoutes)
app.use('/api/payment-requests', paymentRequestRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.get('/', (_req: Request, res: Response) => {
  res.send('ControlWallet API running')
})

// ⬇⬇ Middleware global de errores
const errorHandler: ErrorRequestHandler = (err, _req, res, _next: NextFunction): void => {
  if (
    err?.type === 'entity.too.large' ||
    err?.message?.includes('request entity too large')
  ) {
    console.error('[PayloadTooLargeError]', err)
    res.status(413).json({
      message:
        'La imagen o archivo es demasiado pesado. Prueba con un archivo más ligero (máx. 5 MB).',
    })
    return
  }

  console.error('[GlobalErrorHandler]', err)
  res.status(500).json({
    message:
      'Ocurrió un error en el servidor. Inténtalo nuevamente en unos minutos.',
  })
}

app.use(errorHandler)
// ⬆⬆

export default app

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`)
  })
}

