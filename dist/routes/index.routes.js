"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_route_1 = __importDefault(require("./auth.route"));
const index_routes_1 = __importDefault(require("./admin/index.routes"));
router.use('/auth', auth_route_1.default);
router.use('/admin', index_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.routes.js.map