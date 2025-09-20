import { z } from "zod";

export const createTodoSchema = z.object({
    title: z.string().min(1, "El título es obligatorio"),
    description: z.string().optional(),
});
