import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { IRateLimiterOptions, RateLimiterMemory, RateLimiterUnion } from "rate-limiter-flexible";

export const global = () => {
    const opts = {
        keyPrefix: 'global',
        points: 20,
        duration: 1
    };
    const rateLimiter = new RateLimiterMemory(opts);
    return (req: Request, res: Response, next: NextFunction) => {
        rateLimiter.consume(req.ip)
            .then((rate) => {
                appendRateLimiterHeaders(res, opts, rate);
                next();
            })
            .catch((rate) => {
                appendRateLimiterHeaders(res, opts, rate);
                next(createError(429, { level: 'warn', warn: req.ip}));
            });
    };
};

export const auth = (point: number) => {
    const opts1 = {
        keyPrefix: 'limit1',
        points: 1,
        duration: 1,
    };
    const opts2 = {
        keyPrefix: 'limit2',
        points: point,
        duration: 60 * 60 * 1,
    };

    const limiter1 = new RateLimiterMemory(opts1);
    const limiter2 = new RateLimiterMemory(opts2);
    const rateLimiterUnion = new RateLimiterUnion(limiter1, limiter2);
    return (req: Request, res: Response, next: NextFunction) => {
        rateLimiterUnion.consume(req.ip)
            .then((rate) => {
                appendRateLimiterHeaders(res, opts2, rate);
                next();
            })
            .catch((rate) => {
                appendRateLimiterHeaders(res, opts2, rate);
                next(createError(429, { level: 'warn', warn: req.ip}));
            });
    };
};

function appendRateLimiterHeaders(res: Response, opts: IRateLimiterOptions, rateLimiterRes: any) {
    rateLimiterRes = Object.keys(rateLimiterRes).pop() != null ? rateLimiterRes[Object.keys(rateLimiterRes).pop()!] : null;
    res.header("Retry-After", rateLimiterRes.msBeforeNext || 0 / 1000);
    res.header("RateLimit-Limit", opts.points?.toString());
    res.header("RateLimit-Remaining", rateLimiterRes.remainingPoints || 0);
    res.header("RateLimit-Reset", (rateLimiterRes.msBeforeNext != null ? new Date(Date.now() + rateLimiterRes.msBeforeNext!) : new Date(Date.now())).toString() );
}