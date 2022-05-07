import Joi from "joi";

// POST /v1/pages
export const create = {
    body: Joi.object({
        title: Joi
            .string()
            .required(),
        body: Joi
            .string()
            .required(),
        keywords: Joi
            .array()
            .items(Joi.string())
            .allow(null)
            .example(JSON.stringify(['google', 'tech', 'industry']))
            .required(),
        image: Joi
            .string()
            .required(),
        slug: Joi
            .string()
            .allow(null)
            .required(),
    })
};

// PUT /v1/admin/cms/pages/:id
export const update = {
    body: Joi.object({
        title: Joi
            .string()
            .optional(),
        body: Joi
            .string()
            .optional(),
        keywords: Joi
            .array()
            .items(Joi.string())
            .allow(null)
            .example(JSON.stringify(['google', 'tech', 'industry']))
            .optional(),
        image: Joi
            .string()
            .optional(),
        slug: Joi
            .string()
            .allow(null)
            .optional(),
    }),
    params: Joi.object({
        id: Joi.number().required()
    })
};

// DELETE /v1/admin/cms/pages/:id
export const deletePerm = {
    params: Joi.object({
        id: Joi.number().required()
    })
};

// GET /v1/admin/cms/pages/:id
export const detail = {
    params: Joi.object({
        id: Joi.number().required()
    }),
};

// GET /v1/admin/cms/pages/
export const list = {
    query: Joi.object({
        page: Joi
            .number()
            .integer()
            .required(),
        perPage: Joi
            .number()
            .integer()
            .max(100)
            .required(),
        access_token: Joi
            .string()
            .optional(),
    })
};

// GET /v1/public/cms/pages/:id
export const detailPublic = {
    params: Joi.object({
        id: Joi.string().required()
    }),
};
