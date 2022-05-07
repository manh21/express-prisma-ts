"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_authentication = exports.account_authentication = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("../config/passport");
const account_authentication = (req, res, next) => {
    const client = req.app.locals.prisma;
    (0, passport_2.account_strategy)(passport_1.default, client);
    passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err)
            return next((0, http_errors_1.default)(400, { level: 'error', error: err }));
        if (!user)
            return next((0, http_errors_1.default)(401, { level: 'info', info }));
        req.user = user; // Forward user information to the next middleware
        next();
    })(req, res, next);
};
exports.account_authentication = account_authentication;
const api_authentication = (req, res, next) => {
    (0, passport_2.api_strategy)(passport_1.default);
    passport_1.default.authenticate('bearer', { session: false }, (err, user, info) => {
        if (err)
            return next((0, http_errors_1.default)(400, { level: 'error', error: err }));
        if (!user)
            return next((0, http_errors_1.default)(401, { level: 'info', info }));
        next();
    })(req, res, next);
};
exports.api_authentication = api_authentication;
//# sourceMappingURL=authentication.js.map