import { Request, Response, NextFunction } from "express";
import dayjs from "dayjs";
import createError from "http-errors";

import { sendResetPassword, sendPasswordChangeNotification } from "../services/email/mailer.service";
import { generatePasswordHash, comparePassword } from "../services/auth/password.service";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyResetToken, generateResetToken } from "../services/auth/jwt.service";

import JwtPayload from "../libs/jwt_payload";
import RRequest from "../libs/request";

const ACCESS_TOKEN_INTERVAL = Number(process.env.ACCESS_TOKEN_INTERVAL!);
const REFRESH_TOKEN_DAY = Number(process.env.REFRESH_TOKEN_DAY!);

// POST Login with email and password
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user, token } = req.app.locals.prisma;
        const { password } = req.body;

        // get user data
        const userData = await user.findUnique({
            where: {
                email: req.body.email
            }
        });
        if(userData == null) return next(createError(404, { level: 'info', info: req.body.email }));

        // Check apakah password sama
        if(await comparePassword(password, userData.password) == false) return next(createError(404, { level: 'info', info: req.body.email }));

        // Generate jwt access token
        const accessToken = generateAccessToken(userData);

        // Generate jwt refresh token
        const refreshToken = generateRefreshToken(userData);

        // Store refresh token to db
        await token.create({
            data:{
                token: refreshToken,
                user_id: userData.id,
                expires: dayjs().add(REFRESH_TOKEN_DAY, "days").toISOString()
            }
        });

        // Set cookies
        res.cookie("__refresh__", refreshToken, {
            secure: process.env.NODE_ENV !== "development",
            httpOnly: true,
            expires: dayjs().add(REFRESH_TOKEN_DAY, "days").toDate(),
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
    } catch (error) {
        return next(createError(500, { level: 'error', error: error }));
    }
};

// GET Logout unset refresh cookies
export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.app.locals.prisma;
        // Set cookies
        res.cookie("__refresh__", '', {
            secure: process.env.NODE_ENV !== "development",
            httpOnly: true,
            expires: dayjs().toDate(),
        });

        // Invalidate refresh token in database
        if(req.cookies && req.cookies.__refresh__) {
            await token.deleteMany({
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
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

// GET Generate Access Token with Refresh Cookies
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user, token } = req.app.locals.prisma;
        if(!req.cookies || !req.cookies.__refresh__) return next(createError(400, "Membutuhkan valid refresh token", { level: 'info', info: "Membutuhkan valid refresh token" }));

        // verify refresh token
        const decRef: JwtPayload = await verifyRefreshToken(req.cookies.__refresh__) as JwtPayload;
        if(!decRef) return next(createError(400, "Membutuhkan valid refresh token", { level: 'info', info: "Membutuhkan valid refresh token" }));

        // Check if this is valid refresh token
        const validate = await token.findFirst({
            where: {
                token: req.cookies.__refresh__
            }
        });
        if(!validate) return next(createError(400, "Membutuhkan valid refresh token", { level: 'info', info: "Membutuhkan valid refresh token" }));

        const userData = await user.findUnique({
            where: {
                id: decRef.id
            }
        });

        // Generate jwt access token
        const accessToken = generateAccessToken(userData);

        // Generate jwt refresh token
        const refreshToken = generateRefreshToken(userData);

        // Store refresh token to db
        await token.create({
            data:{
                token: refreshToken,
                user_id: userData.id,
                expires: dayjs().add(REFRESH_TOKEN_DAY, "days").toISOString()
            }
        });

        // Invalidate old refresh token in database
        await token.deleteMany({
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
            expires: dayjs().add(REFRESH_TOKEN_DAY, "days").toDate(),
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
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

// POST Register new user
export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user } = req.app.locals.prisma;
        const { password } = req.body;
        // Check duplicate email
        const emailExist = await user.findUnique({where: {email: req.body.email}});
        if(emailExist) return next(createError(400, "Email sudah digunakan"));

        // Generate password hash
        const hashedPassword = await generatePasswordHash(password);

        // Insert to db
        const userData = await user.create({
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

        if(userData == null) return next(createError(400, "Gagal membuat akun"));
        return res.send({status: '200', message: 'Berhasil melakukan registrasi user', data: userData});
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

// POST Send password rest token to email
export const sendPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user } = req.app.locals.prisma;
        const userData = await user.findUnique({
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
        const resetToken = generateResetToken(userData);

        sendResetPassword(userData, resetToken);
        return res.status(200).send({status: 200, message: "Check your email!"});
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

// POST Reset password with reset token
export const passwordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user } = req.app.locals.prisma;
        const { password } = req.body;

        // verify refresh token
        const decRef: JwtPayload = await verifyResetToken(req.body.resetToken) as JwtPayload;
        if(!decRef) return next(createError(403, {level: 'info', warn: `Invalid request token: ${req.body.resetToken}`}));

        const userData = await user.findUnique({
            where: {
                id: decRef.id,
            }
        });
        if(!userData) return next(createError(404));

        // Generate password hash
        const hashedPassword = generatePasswordHash(password);

        // Update password in db
        const userDataUpdated = await user.update({
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

        if(!userDataUpdated) return next(createError(400));
        sendPasswordChangeNotification(userDataUpdated);
        return res.send({status: '200', message: 'Berhasil reset password', data: userDataUpdated});
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

// POST Change user password
export const changePassword = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const req = _req as RRequest;
        const { user } = req.app.locals.prisma;
        const { password } = req.body;
        // Generate password hash
        const hashedPassword = generatePasswordHash(password);

        // Update password in db
        const userDataUpdated = await user.update({
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

        if(userDataUpdated == null) return next(createError(400));
        sendPasswordChangeNotification(userDataUpdated);
        return res.send({status: '200', message: 'Berhasil merubah password', data: userDataUpdated});
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};