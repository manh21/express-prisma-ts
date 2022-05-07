"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (prisma) => __awaiter(void 0, void 0, void 0, function* () {
    // Special fast path to drop data from a postgres database.
    // This is an optimization which is particularly crucial in a unit testing context.
    // This code path takes milliseconds, vs ~7 seconds for a migrate reset + db push
    const result1 = yield prisma.$queryRaw `SELECT tablename FROM pg_tables WHERE schemaname='public'`;
    for (const { tablename } of result1) {
        if (tablename.includes("_"))
            continue;
        yield prisma.$queryRawUnsafe('TRUNCATE TABLE "' + tablename + '" CASCADE');
    }
    const result2 = yield prisma.$queryRaw `SELECT c.relname FROM pg_class AS c JOIN pg_namespace AS n ON c.relnamespace = n.oid WHERE c.relkind='S' AND n.nspname='public'`;
    for (const { relname } of result2) {
        yield prisma.$queryRawUnsafe('ALTER SEQUENCE "' + relname + '" RESTART WITH 1');
    }
});
//# sourceMappingURL=reset.service.js.map