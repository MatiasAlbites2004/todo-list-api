import { Response } from "express";
import prisma from "../../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES_IN = "1h";

export const register = async (req: any, res: Response) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(StatusCodes.CREATED).json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: error.flatten().fieldErrors });
    }
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: (error as Error).message });
  }
};


export const login = async (req: any, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Usuario no encontrado");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Contraseña incorrecta");

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(StatusCodes.OK).json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: error.flatten().fieldErrors });
    }
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: (error as Error).message });
  }
};
