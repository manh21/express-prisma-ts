import createError from "http-errors";
import passport from "passport";
import { account_strategy, api_strategy } from "../config/passport";
import { Request, Response, NextFunction } from "express";

export const account_authentication = (req: Request, res: Response, next: NextFunction) => {
    const client = req.app.locals.prisma;

    account_strategy(passport, client);

    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err) return next(createError(400, { level: 'error', error: err }));
        if (!user) return next(createError(401, { level: 'info', info }));
        req.user = user; // Forward user information to the next middleware
        next();
    })(req, res, next);
};

export const api_authentication = (req: Request, res: Response, next: NextFunction) => {

    api_strategy(passport);

    passport.authenticate('bearer', {session: false}, (err, user, info) => {
        if (err) return next(createError(400, { level: 'error', error: err }));
        if (!user) return next(createError(401, { level: 'info', info }));
        next();
    })(req, res, next);
};