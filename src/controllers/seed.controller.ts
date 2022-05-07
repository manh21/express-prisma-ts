import { Request, Response } from 'express';
import generateSeed from "../services/seed.service";

export const seedController = async (req: Request, res: Response) => {
    const prisma = req.app.locals.prisma;

    generateSeed(prisma)
        .catch(() => {
            res.send({ status: 500 });
        })
        .finally(async () => {
            res.send({ status: 200 });
        });
};