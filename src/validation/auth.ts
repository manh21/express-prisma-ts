import Joi from "joi";

// POST /v1/auth/register
export const register = {
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
        phone: Joi
            .string()
            .alphanum()
            .required()
    }),
};

// POST /v1/auth/login
export const login = {
    body: Joi.object({
        email: Joi
            .string()
            .email()
            .required(),
        password: Joi
            .string()
            .required()
            .max(128),
    }),
};

// POST /v1/auth/refresh
export const refresh = {
    body: {
        email: Joi
            .string()
            .email()
            .required(),
        refreshToken: Joi
            .string()
            .required(),
    },
};

// POST /v1/auth/send-password-reset
export const sendPasswordReset = {
    body: Joi.object({
        email: Joi
            .string()
            .email()
            .required(),
    }),
};

// POST /v1/auth/password-reset
export const passwordReset = {
    body: Joi.object({
        newPassword: Joi
            .string()
            .required()
            .min(6)
            .max(128),
        newPasswordRepeat: Joi
            .string()
            .required()
            .min(6)
            .max(128)
            .valid(Joi.ref('newPassword')),
        resetToken: Joi
            .string()
            .required(),
    }),
};

// POST /v1/auth/change-password
export const changePassword = {
    body: Joi.object({
        newPassword: Joi
            .string()
            .required()
            .min(6)
            .max(128),
        newPasswordRepeat: Joi
            .string()
            .required()
            .min(6)
            .max(128)
            .valid(Joi.ref('newPassword')),
    })
};