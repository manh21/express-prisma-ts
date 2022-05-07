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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const authorization = (perms) => {
    return (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const req = _req;
        try {
            // Load model
            const { permission, role_permission, user } = req.app.locals.prisma;
            // Check if user exist
            if (!req.user)
                return next((0, http_errors_1.default)(403, { level: 'warn', warn: `User ID:${req.user.id} Perms:${perms} IP:${req.ip || req.socket.remoteAddress}` }));
            const userData = yield user.findUnique({
                where: {
                    id: req.user.id,
                }
            });
            if (userData == null)
                return next((0, http_errors_1.default)(403, { level: 'warn', warn: `User ID:${req.user.id} Perms:${perms} IP:${req.ip || req.socket.remoteAddress}` }));
            const perm = yield permission.findUnique({
                where: {
                    name: perms,
                },
            });
            if (perm == null)
                return next((0, http_errors_1.default)(403, { level: 'warn', warn: `User ID:${req.user.id} Perms:${perms} IP:${req.ip || req.socket.remoteAddress}` }));
            yield role_permission.findFirst({
                where: {
                    role_id: userData.role_id,
                    perm_id: perm.id
                }
            });
            if (userData == null)
                return next((0, http_errors_1.default)(403, { level: 'warn', warn: `User ID:${req.user.id} Perms:${perms} IP:${req.ip || req.socket.remoteAddress}` }));
            res.locals.permission = perm;
            return next();
        }
        catch (error) {
            next((0, http_errors_1.default)(400, { level: 'error', error: error }));
        }
    });
};
exports.authorization = authorization;
//# sourceMappingURL=authorization.js.map