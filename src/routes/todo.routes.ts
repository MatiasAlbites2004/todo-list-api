import { Router } from "express";
import prisma from "../prisma/client";

const router = Router();

router.get("/to-do", async (req, res) => {
    try {
    const todos = await prisma.toDo.findMany({
        select: {
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        },
    });

    res.json(todos);
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching todos" });
    }
});

export default router;
