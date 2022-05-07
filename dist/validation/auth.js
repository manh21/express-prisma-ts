"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.passwordReset = exports.sendPasswordReset = exports.refresh = exports.login = exports.register = void 0;
const joi_1 = __importDefault(require("joi"));
// POST /v1/auth/register
exports.register = {
    body: joi_1.default.object({
        email: joi_1.default
            .string()
            .email()
            .required(),
        password: joi_1.default
            .string()
            .required()
            .min(6)
            .max(128),
        fullName: joi_1.default
            .string()
            .required(),
        phone: joi_1.default
            .string()
            .alphanum()
            .required()
    }),
};
// POST /v1/auth/login
exports.login = {
    body: joi_1.default.object({
        email: joi_1.default
            .string()
            .email()
            .required(),
        password: joi_1.default
            .string()
            .required()
            .max(128),
    }),
};
// POST /v1/auth/refresh
exports.refresh = {
    body: {
        email: joi_1.default
            .string()
            .email()
            .required(),
        refreshToken: joi_1.default
            .string()
            .required(),
    },
};
// POST /v1/auth/send-password-reset
exports.sendPasswordReset = {
    body: joi_1.default.object({
        email: joi_1.default
            .string()
            .email()
            .required(),
    }),
};
// POST /v1/auth/password-reset
exports.passwordReset = {
    body: joi_1.default.object({
        newPassword: joi_1.default
            .string()
            .required()
            .min(6)
            .max(128),
        newPasswordRepeat: joi_1.default
            .string()
            .required()
            .min(6)
            .max(128)
            .valid(joi_1.default.ref('newPassword')),
        resetToken: joi_1.default
            .string()
            .required(),
    }),
};
// POST /v1/auth/change-password
exports.changePassword = {
    body: joi_1.default.object({
        newPassword: joi_1.default
            .string()
            .required()
            .min(6)
            .max(128),
        newPasswordRepeat: joi_1.default
            .string()
            .required()
            .min(6)
            .max(128)
            .valid(joi_1.default.ref('newPassword')),
    })
};
//# sourceMappingURL=auth.js.map