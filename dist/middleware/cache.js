"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const apicache_1 = __importDefault(require("apicache"));
const onlyStatus200 = (_req, res) => res.statusCode === 200;
const opts = {
// debug: true,
// trackPerformance: true
};
const cache = (duration) => {
    return apicache_1.default.options(opts).middleware(duration, onlyStatus200);
};
exports.cache = cache;
//# sourceMappingURL=cache.js.map