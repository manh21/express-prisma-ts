import { Request, Response } from 'express';
import resetDB from "../services/reset.service";

export const resetController = async (req: Request, res: Response) => {
    const prisma = req.app.locals.prisma;

    resetDB(prisma)
        .catch((e) => {
            console.error(e);
            res.send({ status: 500 });
        })
        .finally(async () => {
            res.send({ status: 200 });
        });
};