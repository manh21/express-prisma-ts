"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorization_1 = require("../../middleware/authorization");
const validation_1 = require("../../middleware/validation");
const users_1 = require("../../validation/users");
const controller = __importStar(require("../../controllers/admin/users.controller"));
// Initialize
const router = (0, express_1.Router)();
// Create a new user
router.post('/', (0, authorization_1.authorization)('USER_ADD'), (0, validation_1.validation)(users_1.create.body, 'body'), controller.create);
// Delete User
router.delete('/:id', (0, authorization_1.authorization)('USER_DELETE'), (0, validation_1.validation)(users_1.deleteUser.params, 'params'), controller.remove);
// Update User
router.put('/:id', (0, authorization_1.authorization)('USER_UPDATE'), (0, validation_1.validation)(users_1.update.params, 'params'), (0, validation_1.validation)(users_1.update.body, 'body'), controller.update);
// Get User by id
router.get('/:id', (0, authorization_1.authorization)('USER_DETAIL'), (0, validation_1.validation)(users_1.detail.params, 'params'), controller.detail);
// Get User List
router.get('/', (0, authorization_1.authorization)('USER_LIST'), (0, validation_1.validation)(users_1.list.query, 'query'), controller.list);
exports.default = router;
//# sourceMappingURL=users.route.js.map