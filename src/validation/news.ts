import Joi from "joi";

// POST /v1/admin/cms/news
export const create = {
    body: Joi.object({
        title: Joi
            .string()
            .required(),
        image: Joi
            .string()
            .required(),
        body: Joi
            .string()
            .required(),
        is_publish: Joi
            .boolean()
            .optional(),
        slug: Joi
            .string()
            .optional(),
        categories: Joi
            .array()
            .items(Joi.number())
            .example(JSON.stringify([1, 2, 3]))
            .required(),
        tags: Joi
            .array()
            .items(Joi.string())
            .example(JSON.stringify(['google', 'tech', 'industry']))
            .required(),
        keywords: Joi
            .array()
            .items(Joi.string())
            .allow(null)
            .example(JSON.stringify(['google', 'tech', 'industry']))
            .required(),
    })
};

// PUT /v1/admin/cms/news/:id
export const update = {
    body: Joi.object({
        title: Joi
            .string()
            .optional(),
        image: Joi
            .string()
            .optional(),
        body: Joi
            .string()
            .optional(),
        is_publish: Joi
            .boolean()
            .optional(),
        slug: Joi
            .string()
            .optional(),
        categories: Joi
            .array()
            .items(Joi.number())
            .example(JSON.stringify([1, 2, 3]))
            .optional(),
        tags: Joi
            .array()
            .items(Joi.string())
            .example(JSON.stringify(['google', 'tech', 'industry']))
            .optional(),
        keywords: Joi
            .array()
            .items(Joi.string())
            .allow(null)
            .example(JSON.stringify(['google', 'tech', 'industry']))
            .optional(),
    }),
    params: Joi.object({
        id: Joi.number().required()
    }),
};

// DELETE /v1/admin/cms/news/:id
export const deleteNews = {
    params: Joi.object({
        id: Joi.number().required()
    }),
};

// GET /v1/admin/cms/news/:id
export const detail = {
    params: Joi.object({
        id: Joi.number().required()
    })
};

// GET /v1/admin/cms/news/
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

// GET /v1/public/cms/pages/:id
export const detailPublic = {
    params: Joi.object({
        id: Joi.string().required()
    }),
};
