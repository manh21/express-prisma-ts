"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.detail = exports.deletePerm = exports.update = exports.create = void 0;
const joi_1 = __importDefault(require("joi"));
// POST /v1/menus
exports.create = {
    body: joi_1.default.object({
        name: joi_1.default
            .string()
            .required(),
        url: joi_1.default
            .string()
            .required(),
        order: joi_1.default
            .number()
            .required(),
        parentId: joi_1.default
            .number()
            .allow(null)
            .optional()
    })
};
// PUT /v1/admin/cms/menus/:id
exports.update = {
    body: joi_1.default.object({
        name: joi_1.default
            .string()
            .optional(),
        url: joi_1.default
            .string()
            .optional(),
        order: joi_1.default
            .number()
            .optional(),
        parentId: joi_1.default
            .string()
            .allow(null)
            .optional()
    }),
    params: joi_1.default.object({
        id: joi_1.default.number().required()
    })
};
// DELETE /v1/admin/cms/menus/:id
exports.deletePerm = {
    params: joi_1.default.object({
        id: joi_1.default.number().required()
    })
};
// GET /v1/admin/cms/menus/:id
exports.detail = {
    params: joi_1.default.object({
        id: joi_1.default.number().required()
    })
};
// GET /v1/admin/cms/menus/
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
//# sourceMappingURL=menu.js.map