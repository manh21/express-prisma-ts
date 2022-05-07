import Joi from "joi";

// GET /v1/public/news/
export const list = {
    query: Joi.object({
        cursor: Joi
            .string()
            .optional(),
        limit: Joi
            .number()
            .integer()
            .max(100)
            .optional(),
        title: Joi
            .string()
            .optional(),
        categories: Joi
            .array()
            .items(Joi.string())
            .optional(),
        tags: Joi
            .array()
            .items(Joi.string())
            .optional(),
        keywords: Joi
            .array()
            .items(Joi.string())
            .allow(null)
            .example(JSON.stringify(['google', 'tech', 'industry']))
            .optional(),
        access_token: Joi
            .string()
            .optional(),
    })
};

// GET /v1/public/news/:id
export const detail = {
    params: Joi.object({
        id: Joi.string().required()
    }),
};

// GET /v1/public/news/:id/share
export const share = {
    params: Joi.object({
        id: Joi.string().required()
    }),
};
// GET /v1/public/news/:id/reaction/:reaction_id
export const reaction = {
    params: Joi.object({
        id: Joi.string().required(),
        reaction_id: Joi.string().required()
    }),
};