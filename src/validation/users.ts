import Joi from "joi";

// POST /v1/admin/users
export const create = {
    body: Joi.object({
        email: Joi
            .string()
            .email()
            .required(),
        password: Joi
            .string()
            .required()
            .min(6)
            .max(128),
        fullName: Joi
            .string()
            .required(),
    })
};

// PUT /v1/admin/users/:id
export const update = {
    body: Joi.object({
        email: Joi
            .string()
            .email()
            .optional(),
        fullName: Joi
            .string()
            .optional(),
        phone: Joi
            .string()
            .alphanum()
            .optional(),
        role_id: Joi
            .string()
            .optional(),
    }),
    params: Joi.object({
        id: Joi.number().required()
    })
};

// DELETE /v1/admin/users/:id
export const deleteUser = {
    params: Joi.object({
        id: Joi.number().required()
    })
};

// GET /v1/admin/users/:id
export const detail = {
    params: Joi.object({
        id: Joi.number().required()
    })
};

// GET /v1/admin/users/
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
        email: Joi
            .string()
            .optional(),
        role_id: Joi
            .string()
            .optional(),
    })
};