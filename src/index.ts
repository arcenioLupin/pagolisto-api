import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import authRoutes from './routes/authRoutes'
import cobroRoutes from './routes/cobroRoutes'

dotenv.config()
connectDB()


const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/cobros', cobroRoutes)

app.get('/', (req, res) => {
  res.send('API Pagolisto funcionando')
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
