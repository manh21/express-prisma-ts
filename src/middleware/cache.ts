import apicache from "apicache";
import { Request, Response } from "express";

const onlyStatus200 = (_req: Request, res: Response) => res.statusCode === 200;

const opts = {
    // debug: true,
    // trackPerformance: true
};

export const cache = (duration: number) => {
    return apicache.options(opts).middleware(duration, onlyStatus200);
};