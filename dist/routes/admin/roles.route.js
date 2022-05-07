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
const roles_1 = require("../../validation/roles");
const controller = __importStar(require("../../controllers/admin/roles.controller"));
// Initialize
const router = (0, express_1.Router)();
// Create a new role
router.post('/', (0, authorization_1.authorization)('ROLE_ADD'), (0, validation_1.validation)(roles_1.create.body, 'body'), controller.create);
// Delete Role
router.delete('/:id', (0, authorization_1.authorization)('ROLE_DELETE'), (0, validation_1.validation)(roles_1.deleteRole.params, 'params'), controller.remove);
// Update Role
router.put('/:id', (0, authorization_1.authorization)('ROLE_UPDATE'), (0, validation_1.validation)(roles_1.update.params, 'params'), (0, validation_1.validation)(roles_1.update.body, 'body'), controller.update);
// Get Role by id
router.get('/:id', (0, authorization_1.authorization)('ROLE_DETAIL'), (0, validation_1.validation)(roles_1.detail.params, 'params'), controller.detail);
// Get Role List
router.get('/', (0, authorization_1.authorization)('ROLE_LIST'), (0, validation_1.validation)(roles_1.list.query, 'query'), controller.list);
// Add permission to role
router.post('/permission/:id', (0, validation_1.validation)(roles_1.addPerm.params, 'params'), (0, validation_1.validation)(roles_1.addPerm.body, 'body'), controller.permission);
exports.default = router;
//# sourceMappingURL=roles.route.js.map