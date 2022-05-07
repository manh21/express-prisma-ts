import Joi from "joi";

// GET /v1/admin/cms/category/:id
export const detail = {
    params: Joi.object({
        id: Joi.string().required()
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
