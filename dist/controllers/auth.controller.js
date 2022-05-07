"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.passwordReset = exports.sendPasswordReset = exports.userRegistration = exports.refreshToken = exports.logout = exports.login = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const http_errors_1 = __importDefault(require("http-errors"));
const mailer_service_1 = require("../services/email/mailer.service");
const password_service_1 = require("../services/auth/password.service");
const jwt_service_1 = require("../services/auth/jwt.service");
const ACCESS_TOKEN_INTERVAL = Number(process.env.ACCESS_TOKEN_INTERVAL);
const REFRESH_TOKEN_DAY = Number(process.env.REFRESH_TOKEN_DAY);
// POST Login with email and password
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, token } = req.app.locals.prisma;
        const { password } = req.body;
        // get user data
        const userData = yield user.findUnique({
            where: {
                email: req.body.email
            }
        });
        if (userData == null)
            return next((0, http_errors_1.default)(404, { level: 'info', info: req.body.email }));
        // Check apakah password sama
        if ((yield (0, password_service_1.comparePassword)(password, userData.password)) == false)
            return next((0, http_errors_1.default)(404, { level: 'info', info: req.body.email }));
        // Generate jwt access token
        const accessToken = (0, jwt_service_1.generateAccessToken)(userData);
        // Generate jwt refresh token
        const refreshToken = (0, jwt_service_1.generateRefreshToken)(userData);
        // Store refresh token to db
        yield token.create({
            data: {
                token: refreshToken,
                user_id: userData.id,
                expires: (0, dayjs_1.default)().add(REFRESH_TOKEN_DAY, "days").toISOString()
            }
        });
        // Set cookies
        res.cookie("__refresh__", refreshToken, {
            secure: process.env.NODE_ENV !== "development",
            httpOnly: true,
            expires: (0, dayjs_1.default)().add(REFRESH_TOKEN_DAY, "days").toDate(),
        });
        return res.status(200).send({
            status: 200,
            message: "Berhasil login",
            data: {
                token: {
                    access: accessToken,
                    expiresIn: Math.floor(ACCESS_TOKEN_INTERVAL * 60)
                },
                user: {
                    id: userData.id,
                    email: userData.email,
                    fullName: userData.fullName
                }
            }
        });
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, { level: 'error', error: error }));
    }
});
exports.login = login;
// GET Logout unset refresh cookies
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.app.locals.prisma;
        // Set cookies
        res.cookie("__refresh__", '', {
            secure: process.env.NODE_ENV !== "development",
            httpOnly: true,
            expires: (0, dayjs_1.default)().toDate(),
        });
        // Invalidate refresh token in database
        if (req.cookies && req.cookies.__refresh__) {
            yield token.deleteMany({
                where: {
                    token: {
                        contains: req.cookies.__refresh__
                    }
                }
            });
        }
        return res.status(200).send({
            status: 200,
            message: "Berhasil logout",
        });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.logout = logout;
// GET Generate Access Token with Refresh Cookies
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, token } = req.app.locals.prisma;
        if (!req.cookies || !req.cookies.__refresh__)
            return next((0, http_errors_1.default)(400, "Membutuhkan valid refresh token", { level: 'info', info: "Membutuhkan valid refresh token" }));
        // verify refresh token
        const decRef = yield (0, jwt_service_1.verifyRefreshToken)(req.cookies.__refresh__);
        if (!decRef)
            return next((0, http_errors_1.default)(400, "Membutuhkan valid refresh token", { level: 'info', info: "Membutuhkan valid refresh token" }));
        // Check if this is valid refresh token
        const validate = yield token.findFirst({
            where: {
                token: req.cookies.__refresh__
            }
        });
        if (!validate)
            return next((0, http_errors_1.default)(400, "Membutuhkan valid refresh token", { level: 'info', info: "Membutuhkan valid refresh token" }));
        const userData = yield user.findUnique({
            where: {
                id: decRef.id
            }
        });
        // Generate jwt access token
        const accessToken = (0, jwt_service_1.generateAccessToken)(userData);
        // Generate jwt refresh token
        const refreshToken = (0, jwt_service_1.generateRefreshToken)(userData);
        // Store refresh token to db
        yield token.create({
            data: {
                token: refreshToken,
                user_id: userData.id,
                expires: (0, dayjs_1.default)().add(REFRESH_TOKEN_DAY, "days").toISOString()
            }
        });
        // Invalidate old refresh token in database
        yield token.deleteMany({
            where: {
                token: {
                    contains: req.cookies.__refresh__
                }
            }
        });
        // Set cookies
        res.cookie("__refresh__", refreshToken, {
            secure: process.env.NODE_ENV !== "development",
            httpOnly: true,
            expires: (0, dayjs_1.default)().add(REFRESH_TOKEN_DAY, "days").toDate(),
        });
        return res.status(200).send({
            status: 200,
            message: "Berhasil",
            data: {
                token: {
                    access: accessToken,
                    expiresIn: Math.floor(ACCESS_TOKEN_INTERVAL * 60)
                }
            }
        });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.refreshToken = refreshToken;
// POST Register new user
const userRegistration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req.app.locals.prisma;
        const { password } = req.body;
        // Check duplicate email
        const emailExist = yield user.findUnique({ where: { email: req.body.email } });
        if (emailExist)
            return next((0, http_errors_1.default)(400, "Email sudah digunakan"));
        // Generate password hash
        const hashedPassword = yield (0, password_service_1.generatePasswordHash)(password);
        // Insert to db
        const userData = yield user.create({
            data: {
                email: req.body.email,
                password: hashedPassword,
                fullName: req.body.fullName,
                phone: req.body.phone
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true
            }
        });
        if (userData == null)
            return next((0, http_errors_1.default)(400, "Gagal membuat akun"));
        return res.send({ status: '200', message: 'Berhasil melakukan registrasi user', data: userData });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.userRegistration = userRegistration;
// POST Send password rest token to email
const sendPasswordReset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req.app.locals.prisma;
        const userData = yield user.findUnique({
            where: {
                email: req.body.email
            },
            select: {
                id: true,
                email: true,
                fullName: true
            }
        });
        // Create Reset Token
        const resetToken = (0, jwt_service_1.generateResetToken)(userData);
        (0, mailer_service_1.sendResetPassword)(userData, resetToken);
        return res.status(200).send({ status: 200, message: "Check your email!" });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.sendPasswordReset = sendPasswordReset;
// POST Reset password with reset token
const passwordReset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req.app.locals.prisma;
        const { password } = req.body;
        // verify refresh token
        const decRef = yield (0, jwt_service_1.verifyResetToken)(req.body.resetToken);
        if (!decRef)
            return next((0, http_errors_1.default)(403, { level: 'info', warn: `Invalid request token: ${req.body.resetToken}` }));
        const userData = yield user.findUnique({
            where: {
                id: decRef.id,
            }
        });
        if (!userData)
            return next((0, http_errors_1.default)(404));
        // Generate password hash
        const hashedPassword = (0, password_service_1.generatePasswordHash)(password);
        // Update password in db
        const userDataUpdated = yield user.update({
            where: {
                id: userData.id
            },
            data: {
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
            }
        });
        if (!userDataUpdated)
            return next((0, http_errors_1.default)(400));
        (0, mailer_service_1.sendPasswordChangeNotification)(userDataUpdated);
        return res.send({ status: '200', message: 'Berhasil reset password', data: userDataUpdated });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.passwordReset = passwordReset;
// POST Change user password
const changePassword = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const req = _req;
        const { user } = req.app.locals.prisma;
        const { password } = req.body;
        // Generate password hash
        const hashedPassword = (0, password_service_1.generatePasswordHash)(password);
        // Update password in db
        const userDataUpdated = yield user.update({
            where: {
                id: req.user.id
            },
            data: {
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
            }
        });
        if (userDataUpdated == null)
            return next((0, http_errors_1.default)(400));
        (0, mailer_service_1.sendPasswordChangeNotification)(userDataUpdated);
        return res.send({ status: '200', message: 'Berhasil merubah password', data: userDataUpdated });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.changePassword = changePassword;
//# sourceMappingURL=auth.controller.js.map