import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'pagolistoDev'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, businessName } = req.body

    const userExist = await User.findOne({ email })
    if (userExist) return res.status(400).json({ message: 'Correo ya registrado' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      email,
      password: hashedPassword,
      businessName
    })

    await newUser.save()

    res.status(201).json({ message: 'Usuario registrado correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas' })

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    })

    res.json({ token, user: { email: user.email, businessName: user.businessName } })
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error })
  }
}
