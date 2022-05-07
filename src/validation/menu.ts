import Joi from "joi";

// POST /v1/menus
export const create = {
    body: Joi.object({
        name: Joi
            .string()
            .required(),
        url: Joi
            .string()
            .required(),
        order: Joi
            .number()
            .required(),
        parentId: Joi
            .number()
            .allow(null)
            .optional()
    })
};

// PUT /v1/admin/cms/menus/:id
export const update = {
    body: Joi.object({
        name: Joi
            .string()
            .optional(),
        url: Joi
            .string()
            .optional(),
        order: Joi
            .number()
            .optional(),
        parentId: Joi
            .string()
            .allow(null)
            .optional()
    }),
    params: Joi.object({
        id: Joi.number().required()
    })
};

// DELETE /v1/admin/cms/menus/:id
export const deletePerm = {
    params: Joi.object({
        id: Joi.number().required()
    })
};

// GET /v1/admin/cms/menus/:id
export const detail = {
    params: Joi.object({
        id: Joi.number().required()
    })
};

// GET /v1/admin/cms/menus/
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
