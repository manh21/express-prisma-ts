import jwt from "jsonwebtoken";
import JwtPayload from "../../libs/jwt_payload";
import User from "../../libs/user";

const ACCESS_TOKEN_INTERVAL = Number(process.env.ACCESS_TOKEN_INTERVAL!);
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY!;
const REFRESH_TOKEN_DAY = Number(process.env.REFRESH_TOKEN_DAY!);
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY!;
const RESET_TOKEN_SECRET_KEY = process.env.RESET_TOKEN_SECRET_KEY!;

export const generateAccessToken = (user: User) => {
    const iat = Math.floor(Date.now() / 1000) - 10;
    const exp = Math.floor(Date.now() / 1000) + 60 * ACCESS_TOKEN_INTERVAL;
    const payload:JwtPayload = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        type: "access_token",
        iat: iat,
        exp: exp,
    };

    return jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY);
};

export const verifyAccessToken = (token: string) => {
    return new Promise((resolve) => {
        try {
            const payload = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
            resolve(payload);
        } catch (error) {
            resolve(false);
        }
    });
};

export const generateRefreshToken = (user: User) => {
    const iat = Math.floor(Date.now() / 1000) - 10;
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * REFRESH_TOKEN_DAY;
    const payload = {
        id: user.id,
        type: "refresh_token",
        iat: iat,
        exp: exp,
    };

    return jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY);
};

export const verifyRefreshToken = (token: string) => {
    return new Promise((resolve) => {
        try {
            const payload = jwt.verify(token, REFRESH_TOKEN_SECRET_KEY);
            resolve(payload);
        } catch (error) {
            resolve(false);
        }
    });
};

export const generateResetToken = (user: User) => {
    const iat = Math.floor(Date.now() / 1000) - 10;
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 2;
    const payload: JwtPayload = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        type: "reset_token",
        iat: iat,
        exp: exp,
    };

    return jwt.sign(payload, RESET_TOKEN_SECRET_KEY);
};

export const verifyResetToken = (token: string) => {
    return new Promise((resolve) => {
        try {
            const payload: JwtPayload = jwt.verify(token, RESET_TOKEN_SECRET_KEY) as JwtPayload;
            resolve(payload);
        } catch (error) {
            resolve(false);
        }
    });
};