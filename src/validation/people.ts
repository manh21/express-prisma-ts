import Joi from "joi";

// POST /v1/admin/cms/people
export const create = {
    body: Joi.object({
        name: Joi
            .string()
            .required(),
        description: Joi
            .string()
            .required(),
        imageUrl: Joi
            .string()
            .required(),
        order: Joi
            .number()
            .required(),
        other: Joi
            .array()
            .allow(null)
            .optional()
    })
};

// PUT /v1/admin/cms/people/:id
export const update = {
    body: Joi.object({
        name: Joi
            .string()
            .optional(),
        description: Joi
            .string()
            .optional(),
        imageUrl: Joi
            .string()
            .optional(),
        order: Joi
            .number()
            .optional(),
        other: Joi
            .array()
            .allow(null)
            .optional()
    }),
    params: Joi.object({
        id: Joi.number().required()
    })
};

// DELETE /v1/admin/cms/people/:id
export const deletePerm = {
    params: Joi.object({
        id: Joi.number().required()
    })
};

// GET /v1/admin/cms/people/:id
export const detail = {
    params: Joi.object({
        id: Joi.number().required()
    })
};

// GET /v1/admin/cms/people/
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
