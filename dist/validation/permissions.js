"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.detail = exports.deletePerm = exports.update = exports.create = void 0;
const joi_1 = __importDefault(require("joi"));
// POST /v1/admin/permissions/
exports.create = {
    body: joi_1.default.object({
        name: joi_1.default
            .string()
            .required(),
        description: joi_1.default
            .string()
            .optional()
    })
};
// PUT /v1/admin/permissions/:id
exports.update = {
    body: joi_1.default.object({
        name: joi_1.default
            .string()
            .optional(),
        description: joi_1.default
            .string()
            .optional(),
        access_token: joi_1.default
            .string()
            .optional(),
    }),
    params: joi_1.default.object({
        id: joi_1.default.number().required()
    })
};
// DELETE /v1/admin/permissions/:id
exports.deletePerm = {
    params: joi_1.default.object({
        id: joi_1.default.number().required()
    })
};
// GET /v1/admin/permissions/:id
exports.detail = {
    params: joi_1.default.object({
        id: joi_1.default.number().required()
    })
};
// GET /v1/admin/permissions/
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
    })
};
//# sourceMappingURL=permissions.js.map