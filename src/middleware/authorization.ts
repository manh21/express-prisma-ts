import createError from "http-errors";
import RRequest from "../libs/request";
import { Request, Response, NextFunction } from "express";

export const authorization = (perms: string) => {
    return async (_req: Request, res: Response, next: NextFunction) => {
        const req: RRequest = _req as RRequest;
        try {
            // Load model
            const { permission, role_permission, user } = req.app.locals.prisma;

            // Check if user exist
            if(!req.user) return next(createError(403, { level: 'warn', warn: `User ID:${req.user.id } Perms:${perms} IP:${req.ip || req.socket.remoteAddress}` }));

            const userData = await user.findUnique({
                where: {
                    id: req.user.id,
                }
            });
            if(userData == null) return next(createError(403, { level: 'warn', warn: `User ID:${req.user.id} Perms:${perms} IP:${req.ip || req.socket.remoteAddress}` }));

            const perm = await permission.findUnique({
                where: {
                    name: perms,
                },
            });
            if(perm == null) return next(createError(403, { level: 'warn', warn: `User ID:${req.user.id} Perms:${perms} IP:${req.ip || req.socket.remoteAddress}` }));

            await role_permission.findFirst({
                where: {
                    role_id: userData.role_id,
                    perm_id: perm.id
                }
            });

            if(userData == null) return next(createError(403, { level: 'warn', warn: `User ID:${req.user.id} Perms:${perms} IP:${req.ip || req.socket.remoteAddress}` }));
            res.locals.permission = perm;
            return next();
        } catch (error) {
            next(createError(400, { level: 'error', error: error }));
        }
    };
};