import Joi from "joi";

// POST /v1/admin/roles
export const create = {
    body: Joi.object({
        name: Joi
            .string()
            .required(),
        description: Joi
            .string()
            .required()
    })
};

// PUT /v1/admin/roles/:id
export const update = {
    body: Joi.object({
        name: Joi
            .string()
            .optional(),
        description: Joi
            .string()
            .optional(),
    }),
    params: Joi.object({
        id: Joi.number().required()
    })
};

// DELETE /v1/admin/roles/:id
export const deleteRole = {
    params: Joi.object({
        id: Joi.number().required()
    })
};

// GET /v1/admin/roles/:id
export const detail = {
    params: Joi.object({
        id: Joi.number().required()
    })
};

// GET /v1/admin/roles/
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

// POSR /v1/admin/roles/permission/:id
export const addPerm = {
    params: Joi.object({
        id: Joi.number().required()
    }),
    body: Joi.object({
        permission: Joi.array().required()
    })
};