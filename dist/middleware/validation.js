"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const validation = (schema, property = 'body') => {
    return (req, _res, next) => {
        try {
            const { error } = schema.validate(req[property]);
            const valid = error == null;
            if (valid) {
                next();
            }
            else {
                const { details } = error;
                const message = details.map(i => i.message).join(',');
                next((0, http_errors_1.default)(400, { level: 'info', errMsg: message, info: message }));
            }
        }
        catch (error) {
            next((0, http_errors_1.default)(400, { level: 'error', error: error }));
        }
    };
};
exports.validation = validation;
//# sourceMappingURL=validation.js.map