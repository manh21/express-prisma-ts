import { PrismaClient } from "@prisma/client";
import app from "../app";

export const createServer = (prisma: PrismaClient) => {
    app.locals.prisma = prisma;

    return app;
};