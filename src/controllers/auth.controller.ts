import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { StatusCodes } from "http-status-codes";
import { registerUser, loginUser } from "../services/auth.service";
import { ZodError } from "zod";

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
