import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { StatusCodes } from "http-status-codes";
import { registerUser, loginUser } from "../services/auth.service";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES_IN = "1h";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const result = await registerUser(name, email, password);
    res.status(StatusCodes.CREATED).json(result);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: error.flatten().fieldErrors });
    }
    res.status(StatusCodes.BAD_REQUEST).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await loginUser(email, password);
    res.status(StatusCodes.OK).json(result);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: error.flatten().fieldErrors });
    }
    res.status(StatusCodes.BAD_REQUEST).json({ error: (error as Error).message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Usuario no encontrado" });
    }

    const newToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(StatusCodes.OK).json({ user, token: newToken });
  } catch (error) {
    console.error("Error al refrescar token:", error);
    res.status(StatusCodes.UNAUTHORIZED).json({ error: "Token inválido o expirado" });
  }
};
