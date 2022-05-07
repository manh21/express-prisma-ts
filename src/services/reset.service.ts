/* eslint-disable no-useless-escape */
import { PrismaClient } from "@prisma/client";

export default async (prisma: PrismaClient) => {
    // Special fast path to drop data from a postgres database.
    // This is an optimization which is particularly crucial in a unit testing context.
    // This code path takes milliseconds, vs ~7 seconds for a migrate reset + db push

    const result1: any = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`;
    for (const { tablename } of result1) {
        if(tablename.includes("_")) continue;
        await prisma.$queryRawUnsafe('TRUNCATE TABLE "'+ tablename +'" CASCADE');
    }

    const result2: any = await prisma.$queryRaw`SELECT c.relname FROM pg_class AS c JOIN pg_namespace AS n ON c.relnamespace = n.oid WHERE c.relkind='S' AND n.nspname='public'`;
    for (const { relname } of result2) {
        await prisma.$queryRawUnsafe('ALTER SEQUENCE "'+ relname +'" RESTART WITH 1');
    }
};