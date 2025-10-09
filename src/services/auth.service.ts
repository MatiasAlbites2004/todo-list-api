import prisma from "../../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES_IN = "1h";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("El email ya está registrado");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user: { id: user.id, name: user.name, email: user.email }, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Usuario no encontrado");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Contraseña incorrecta");

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user: { id: user.id, name: user.name, email: user.email }, token };
};

export const refreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) throw new Error("Usuario no encontrado");

    const newToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token: newToken,
    };
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
};
