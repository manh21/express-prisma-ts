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
exports.resetController = void 0;
const reset_service_1 = __importDefault(require("../services/reset.service"));
const resetController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = req.app.locals.prisma;
    (0, reset_service_1.default)(prisma)
        .catch((e) => {
        console.error(e);
        res.send({ status: 500 });
    })
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        res.send({ status: 200 });
    }));
});
exports.resetController = resetController;
//# sourceMappingURL=reset.controller.js.map