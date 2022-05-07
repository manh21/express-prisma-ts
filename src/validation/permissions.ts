import Joi from "joi";

// POST /v1/admin/permissions/
export const create = {
    body: Joi.object({
        name: Joi
            .string()
            .required(),
        description: Joi
            .string()
            .optional()
    })
};

// PUT /v1/admin/permissions/:id
export const update = {
    body: Joi.object({
        name: Joi
            .string()
            .optional(),
        description: Joi
            .string()
            .optional(),
        access_token: Joi
            .string()
            .optional(),
    }),
    params: Joi.object({
        id: Joi.number().required()
    })
};

// DELETE /v1/admin/permissions/:id
export const deletePerm = {
    params: Joi.object({
        id: Joi.number().required()
    })
};

// GET /v1/admin/permissions/:id
export const detail = {
    params: Joi.object({
        id: Joi.number().required()
    })
};

// GET /v1/admin/permissions/
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
        name: Joi
            .string()
            .optional(),
    })
};