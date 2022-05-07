"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reaction = exports.share = exports.detail = exports.list = void 0;
const joi_1 = __importDefault(require("joi"));
// GET /v1/public/news/
exports.list = {
    query: joi_1.default.object({
        cursor: joi_1.default
            .string()
            .optional(),
        limit: joi_1.default
            .number()
            .integer()
            .max(100)
            .optional(),
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
// GET /v1/public/news/:id
exports.detail = {
    params: joi_1.default.object({
        id: joi_1.default.string().required()
    }),
};
// GET /v1/public/news/:id/share
exports.share = {
    params: joi_1.default.object({
        id: joi_1.default.string().required()
    }),
};
// GET /v1/public/news/:id/reaction/:reaction_id
exports.reaction = {
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
        reaction_id: joi_1.default.string().required()
    }),
};
//# sourceMappingURL=news.js.map