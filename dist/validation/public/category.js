"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.detail = void 0;
const joi_1 = __importDefault(require("joi"));
// GET /v1/admin/cms/category/:id
exports.detail = {
    params: joi_1.default.object({
        id: joi_1.default.string().required()
    })
};
// GET /v1/admin/cms/category/
exports.list = {
    query: joi_1.default.object({
        page: joi_1.default
            .number()
            .integer()
            .required(),
        perPage: joi_1.default
            .number()
            .integer()
            .max(100)
            .required(),
        access_token: joi_1.default
            .string()
            .optional(),
    })
};
//# sourceMappingURL=category.js.map