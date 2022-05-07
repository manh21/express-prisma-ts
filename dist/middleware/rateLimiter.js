"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.global = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const global = () => {
    const opts = {
        keyPrefix: 'global',
        points: 20,
        duration: 1
    };
    const rateLimiter = new rate_limiter_flexible_1.RateLimiterMemory(opts);
    return (req, res, next) => {
        rateLimiter.consume(req.ip)
            .then((rate) => {
            appendRateLimiterHeaders(res, opts, rate);
            next();
        })
            .catch((rate) => {
            appendRateLimiterHeaders(res, opts, rate);
            next((0, http_errors_1.default)(429, { level: 'warn', warn: req.ip }));
        });
    };
};
exports.global = global;
const auth = (point) => {
    const opts1 = {
        keyPrefix: 'limit1',
        points: 1,
        duration: 1,
    };
    const opts2 = {
        keyPrefix: 'limit2',
        points: point,
        duration: 60 * 60 * 1,
    };
    const limiter1 = new rate_limiter_flexible_1.RateLimiterMemory(opts1);
    const limiter2 = new rate_limiter_flexible_1.RateLimiterMemory(opts2);
    const rateLimiterUnion = new rate_limiter_flexible_1.RateLimiterUnion(limiter1, limiter2);
    return (req, res, next) => {
        rateLimiterUnion.consume(req.ip)
            .then((rate) => {
            appendRateLimiterHeaders(res, opts2, rate);
            next();
        })
            .catch((rate) => {
            appendRateLimiterHeaders(res, opts2, rate);
            next((0, http_errors_1.default)(429, { level: 'warn', warn: req.ip }));
        });
    };
};
exports.auth = auth;
function appendRateLimiterHeaders(res, opts, rateLimiterRes) {
    var _a;
    rateLimiterRes = Object.keys(rateLimiterRes).pop() != null ? rateLimiterRes[Object.keys(rateLimiterRes).pop()] : null;
    res.header("Retry-After", rateLimiterRes.msBeforeNext || 0 / 1000);
    res.header("RateLimit-Limit", (_a = opts.points) === null || _a === void 0 ? void 0 : _a.toString());
    res.header("RateLimit-Remaining", rateLimiterRes.remainingPoints || 0);
    res.header("RateLimit-Reset", (rateLimiterRes.msBeforeNext != null ? new Date(Date.now() + rateLimiterRes.msBeforeNext) : new Date(Date.now())).toString());
}
//# sourceMappingURL=rateLimiter.js.map