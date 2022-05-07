import { Router } from "express";
import { auth as authLimiter } from "../middleware/rateLimiter";
import { validation } from "../middleware/validation";
import { authorization } from "../middleware/authorization";
import { account_authentication } from "../middleware/authentication";
import { login, register, sendPasswordReset, passwordReset, changePassword } from "../validation/auth";

// Controller
import * as authController from "../controllers/auth.controller";

// Initialize
const router = Router();

// POST User Login
router.post('/login', authLimiter(30), validation(login.body), authController.login);

// GET Logout
router.get('/logout', authLimiter(30), authController.logout);

// GET Refresh Token
router.get('/refresh-token', authLimiter(60), authController.refreshToken);

// POST User Registration
router.post('/register', authLimiter(5), validation(register.body), authController.userRegistration);

// POST Send Password Reset
router.post('/send-password-reset', authLimiter(5), validation(sendPasswordReset.body), authController.sendPasswordReset);

// POST Password Reset
router.post('/password-reset', authLimiter(5), validation(passwordReset.body), authController.passwordReset);

// POST Change Password
router.post('/change-password', authLimiter(5), account_authentication, () => authorization('AUTH_SELF_CHANGE_PASSWORD'), validation(changePassword.body), authController.changePassword);

export default router;