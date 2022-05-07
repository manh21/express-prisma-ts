"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyResetToken = exports.generateResetToken = exports.verifyRefreshToken = exports.generateRefreshToken = exports.verifyAccessToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN_INTERVAL = Number(process.env.ACCESS_TOKEN_INTERVAL);
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_DAY = Number(process.env.REFRESH_TOKEN_DAY);
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;
const RESET_TOKEN_SECRET_KEY = process.env.RESET_TOKEN_SECRET_KEY;
const generateAccessToken = (user) => {
    const iat = Math.floor(Date.now() / 1000) - 10;
    const exp = Math.floor(Date.now() / 1000) + 60 * ACCESS_TOKEN_INTERVAL;
    const payload = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        type: "access_token",
        iat: iat,
        exp: exp,
    };
    return jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET_KEY);
};
exports.generateAccessToken = generateAccessToken;
const verifyAccessToken = (token) => {
    return new Promise((resolve) => {
        try {
            const payload = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET_KEY);
            resolve(payload);
        }
        catch (error) {
            resolve(false);
        }
    });
};
exports.verifyAccessToken = verifyAccessToken;
const generateRefreshToken = (user) => {
    const iat = Math.floor(Date.now() / 1000) - 10;
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * REFRESH_TOKEN_DAY;
    const payload = {
        id: user.id,
        type: "refresh_token",
        iat: iat,
        exp: exp,
    };
    return jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN_SECRET_KEY);
};
exports.generateRefreshToken = generateRefreshToken;
const verifyRefreshToken = (token) => {
    return new Promise((resolve) => {
        try {
            const payload = jsonwebtoken_1.default.verify(token, REFRESH_TOKEN_SECRET_KEY);
            resolve(payload);
        }
        catch (error) {
            resolve(false);
        }
    });
};
exports.verifyRefreshToken = verifyRefreshToken;
const generateResetToken = (user) => {
    const iat = Math.floor(Date.now() / 1000) - 10;
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 2;
    const payload = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        type: "reset_token",
        iat: iat,
        exp: exp,
    };
    return jsonwebtoken_1.default.sign(payload, RESET_TOKEN_SECRET_KEY);
};
exports.generateResetToken = generateResetToken;
const verifyResetToken = (token) => {
    return new Promise((resolve) => {
        try {
            const payload = jsonwebtoken_1.default.verify(token, RESET_TOKEN_SECRET_KEY);
            resolve(payload);
        }
        catch (error) {
            resolve(false);
        }
    });
};
exports.verifyResetToken = verifyResetToken;
//# sourceMappingURL=jwt.service.js.map