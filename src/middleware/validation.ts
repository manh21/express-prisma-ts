import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

export const validation = (schema: Schema, property = 'body') => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            const { error } = schema.validate(req[property as keyof Request]);
            const valid = error == null;

            if (valid) {
                next();
            } else {
                const { details } = error;
                const message = details.map(i => i.message).join(',');
                next(createError(400, { level: 'info', errMsg: message, info: message}));
            }
        } catch (error) {
            next(createError(400, { level: 'error', error: error }));
        }
    };
};