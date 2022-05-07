"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../../middleware/authentication");
const router = (0, express_1.Router)();
const users_route_1 = __importDefault(require("./users.route"));
const roles_route_1 = __importDefault(require("./roles.route"));
const permissions_route_1 = __importDefault(require("./permissions.route"));
// Authenticated Access to the API
router.use(authentication_1.account_authentication);
router.use('/users', users_route_1.default);
router.use('/roles', roles_route_1.default);
router.use('/permissions', permissions_route_1.default);
exports.default = router;
//# sourceMappingURL=index.routes.js.map