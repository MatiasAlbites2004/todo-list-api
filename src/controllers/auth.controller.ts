import { Request, Response } from "express";
import { registerUser } from "../services/auth.service";
import { StatusCodes } from "http-status-codes";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const user = await registerUser(name, email, password);
    res.status(StatusCodes.CREATED).json(user);
  } catch (error: any) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.message || "Error al registrar usuario" });
  }
};
