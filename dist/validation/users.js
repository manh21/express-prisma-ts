"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.detail = exports.deleteUser = exports.update = exports.create = void 0;
const joi_1 = __importDefault(require("joi"));
// POST /v1/admin/users
exports.create = {
    body: joi_1.default.object({
        email: joi_1.default
            .string()
            .email()
            .required(),
        password: joi_1.default
            .string()
            .required()
            .min(6)
            .max(128),
        fullName: joi_1.default
            .string()
            .required(),
    })
};
// PUT /v1/admin/users/:id
exports.update = {
    body: joi_1.default.object({
        email: joi_1.default
            .string()
            .email()
            .optional(),
        fullName: joi_1.default
            .string()
            .optional(),
        phone: joi_1.default
            .string()
            .alphanum()
            .optional(),
        role_id: joi_1.default
            .string()
            .optional(),
    }),
    params: joi_1.default.object({
        id: joi_1.default.number().required()
    })
};
// DELETE /v1/admin/users/:id
exports.deleteUser = {
    params: joi_1.default.object({
        id: joi_1.default.number().required()
    })
};
// GET /v1/admin/users/:id
exports.detail = {
    params: joi_1.default.object({
        id: joi_1.default.number().required()
    })
};
// GET /v1/admin/users/
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
        name: joi_1.default
            .string()
            .optional(),
        email: joi_1.default
            .string()
            .optional(),
        role_id: joi_1.default
            .string()
            .optional(),
    })
};
//# sourceMappingURL=users.js.map