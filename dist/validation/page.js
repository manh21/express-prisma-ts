"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailPublic = exports.list = exports.detail = exports.deletePerm = exports.update = exports.create = void 0;
const joi_1 = __importDefault(require("joi"));
// POST /v1/pages
exports.create = {
    body: joi_1.default.object({
        title: joi_1.default
            .string()
            .required(),
        body: joi_1.default
            .string()
            .required(),
        keywords: joi_1.default
            .array()
            .items(joi_1.default.string())
            .allow(null)
            .example(JSON.stringify(['google', 'tech', 'industry']))
            .required(),
        image: joi_1.default
            .string()
            .required(),
        slug: joi_1.default
            .string()
            .allow(null)
            .required(),
    })
};
// PUT /v1/admin/cms/pages/:id
exports.update = {
    body: joi_1.default.object({
        title: joi_1.default
            .string()
            .optional(),
        body: joi_1.default
            .string()
            .optional(),
        keywords: joi_1.default
            .array()
            .items(joi_1.default.string())
            .allow(null)
            .example(JSON.stringify(['google', 'tech', 'industry']))
            .optional(),
        image: joi_1.default
            .string()
            .optional(),
        slug: joi_1.default
            .string()
            .allow(null)
            .optional(),
    }),
    params: joi_1.default.object({
        id: joi_1.default.number().required()
    })
};
// DELETE /v1/admin/cms/pages/:id
exports.deletePerm = {
    params: joi_1.default.object({
        id: joi_1.default.number().required()
    })
};
// GET /v1/admin/cms/pages/:id
exports.detail = {
    params: joi_1.default.object({
        id: joi_1.default.number().required()
    }),
};
// GET /v1/admin/cms/pages/
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
// GET /v1/public/cms/pages/:id
exports.detailPublic = {
    params: joi_1.default.object({
        id: joi_1.default.string().required()
    }),
};
//# sourceMappingURL=page.js.map