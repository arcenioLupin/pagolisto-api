import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { createdResponse, errorResponse, successResponse } from '../utils/response'

const JWT_SECRET = process.env.JWT_SECRET || 'pagolistoDev'

// Registro de usuario (comercio)
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, businessName } = req.body

    const userExist = await User.findOne({ email })
    if (userExist) {
      return errorResponse(res, 'Correo ya registrado', 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      email,
      password: hashedPassword,
      businessName,
    })

    const user = await newUser.save()

      const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return createdResponse(res, 'Usuario registrado correctamente',{
      token,
      user: { email: user.email, businessName: user.businessName },
    })
  } catch (error) {
    return errorResponse(res, 'Error al registrar usuario', 500, error)
  }
}

// Inicio de sesión
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return errorResponse(res, 'Credenciales inválidas', 401)
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return errorResponse(res, 'Credenciales inválidas', 401)
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return successResponse(res, 'Inicio de sesión exitoso', {
      token,
      user: { email: user.email, businessName: user.businessName },
    })
  } catch (error) {
    return errorResponse(res, 'Error al iniciar sesión', 500, error)
  }
}
