"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailPublic = exports.list = exports.detail = exports.deleteNews = exports.update = exports.create = void 0;
const joi_1 = __importDefault(require("joi"));
// POST /v1/admin/cms/news
exports.create = {
    body: joi_1.default.object({
        title: joi_1.default
            .string()
            .required(),
        image: joi_1.default
            .string()
            .required(),
        body: joi_1.default
            .string()
            .required(),
        is_publish: joi_1.default
            .boolean()
            .optional(),
        slug: joi_1.default
            .string()
            .optional(),
        categories: joi_1.default
            .array()
            .items(joi_1.default.number())
            .example(JSON.stringify([1, 2, 3]))
            .required(),
        tags: joi_1.default
            .array()
            .items(joi_1.default.string())
            .example(JSON.stringify(['google', 'tech', 'industry']))
            .required(),
        keywords: joi_1.default
            .array()
            .items(joi_1.default.string())
            .allow(null)
            .example(JSON.stringify(['google', 'tech', 'industry']))
            .required(),
    })
};
// PUT /v1/admin/cms/news/:id
exports.update = {
    body: joi_1.default.object({
        title: joi_1.default
            .string()
            .optional(),
        image: joi_1.default
            .string()
            .optional(),
        body: joi_1.default
            .string()
            .optional(),
        is_publish: joi_1.default
            .boolean()
            .optional(),
        slug: joi_1.default
            .string()
            .optional(),
        categories: joi_1.default
            .array()
            .items(joi_1.default.number())
            .example(JSON.stringify([1, 2, 3]))
            .optional(),
        tags: joi_1.default
            .array()
            .items(joi_1.default.string())
            .example(JSON.stringify(['google', 'tech', 'industry']))
            .optional(),
        keywords: joi_1.default
            .array()
            .items(joi_1.default.string())
            .allow(null)
            .example(JSON.stringify(['google', 'tech', 'industry']))
            .optional(),
    }),
    params: joi_1.default.object({
        id: joi_1.default.number().required()
    }),
};
// DELETE /v1/admin/cms/news/:id
exports.deleteNews = {
    params: joi_1.default.object({
        id: joi_1.default.number().required()
    }),
};
// GET /v1/admin/cms/news/:id
exports.detail = {
    params: joi_1.default.object({
        id: joi_1.default.number().required()
    })
};
// GET /v1/admin/cms/news/
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
        title: joi_1.default
            .string()
            .optional(),
        categories: joi_1.default
            .array()
            .items(joi_1.default.string())
            .optional(),
        tags: joi_1.default
            .array()
            .items(joi_1.default.string())
            .optional(),
        keywords: joi_1.default
            .array()
            .items(joi_1.default.string())
            .allow(null)
            .example(JSON.stringify(['google', 'tech', 'industry']))
            .optional(),
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
//# sourceMappingURL=news.js.map