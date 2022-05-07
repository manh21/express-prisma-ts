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
const rateLimiter_1 = require("../middleware/rateLimiter");
const validation_1 = require("../middleware/validation");
const authorization_1 = require("../middleware/authorization");
const authentication_1 = require("../middleware/authentication");
const auth_1 = require("../validation/auth");
// Controller
const authController = __importStar(require("../controllers/auth.controller"));
// Initialize
const router = (0, express_1.Router)();
// POST User Login
router.post('/login', (0, rateLimiter_1.auth)(30), (0, validation_1.validation)(auth_1.login.body), authController.login);
// GET Logout
router.get('/logout', (0, rateLimiter_1.auth)(30), authController.logout);
// GET Refresh Token
router.get('/refresh-token', (0, rateLimiter_1.auth)(60), authController.refreshToken);
// POST User Registration
router.post('/register', (0, rateLimiter_1.auth)(5), (0, validation_1.validation)(auth_1.register.body), authController.userRegistration);
// POST Send Password Reset
router.post('/send-password-reset', (0, rateLimiter_1.auth)(5), (0, validation_1.validation)(auth_1.sendPasswordReset.body), authController.sendPasswordReset);
// POST Password Reset
router.post('/password-reset', (0, rateLimiter_1.auth)(5), (0, validation_1.validation)(auth_1.passwordReset.body), authController.passwordReset);
// POST Change Password
router.post('/change-password', (0, rateLimiter_1.auth)(5), authentication_1.account_authentication, () => (0, authorization_1.authorization)('AUTH_SELF_CHANGE_PASSWORD'), (0, validation_1.validation)(auth_1.changePassword.body), authController.changePassword);
exports.default = router;
//# sourceMappingURL=auth.route.js.map