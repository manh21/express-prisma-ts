import Joi from "joi";

// POST /v1/admin/cms/category
export const create = {
    body: Joi.object({
        name: Joi
            .string()
            .required(),
        description: Joi
            .string()
            .required(),
        image_url: Joi
            .string()
            .required(),
        meta: Joi
            .array()
            .required(),
    })
};

// PUT /v1/admin/cms/category/:id
export const update = {
    body: Joi.object({
        name: Joi
            .string()
            .optional(),
        description: Joi
            .string()
            .optional(),
        image_url: Joi
            .string()
            .optional(),
        meta: Joi
            .array()
            .optional(),
    }),
    params: Joi.object({
        id: Joi.number().required()
    })
};

// DELETE /v1/admin/cms/category/:id
export const deletePerm = {
    params: Joi.object({
        id: Joi.number().required()
    })
};

// GET /v1/admin/cms/category/:id
export const detail = {
    params: Joi.object({
        id: Joi.number().required()
    })
};

// GET /v1/admin/cms/category/
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
