"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const app_1 = __importDefault(require("../app"));
const createServer = (prisma) => {
    app_1.default.locals.prisma = prisma;
    return app_1.default;
};
exports.createServer = createServer;
//# sourceMappingURL=createServer.js.map