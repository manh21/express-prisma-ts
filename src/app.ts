import express, { Express, NextFunction, Request, Response } from "express";
import { loggerMorgan, Logger } from "./config/logger";
import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

const app: Express = express();

// Route File
import indexRouter from "./routes/index.routes";
import defaultRoute from "./routes/default.route";

// Express extension
app.use(loggerMorgan);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIES_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
app.use(helmet());
app.use(cors({
    credentials: true,
    origin: function(_origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        return callback(null, true);
    }
}));

// Static Files
app.use('/content', express.static(path.resolve(__dirname, './../public')));

// Rate Limit
// app.set('trust proxy', 1);
// app.use(rateLimiter.global());

// Register Route
app.use('/api/v1', indexRouter);
app.use(defaultRoute);

// catch 404 and forward to error handler
app.use(function(_req: Request, _res: Response, next: NextFunction) {
    next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    const content = {
        status: err.status || 500,
        message: err.message,
        error: err.errMsg
    };

    switch (err.level) {
        case 'error':
            Logger.error(err.error.stack);
            break;
        case 'warn':
            Logger.warn(err.warn);
            break;
        case 'info':
            Logger.info(err.info);
            break;
        case 'debug':
            Logger.debug(err.debug);
            break;
        default:
            break;
    }

    res.status(err.status || 500);
    res.send(content);

    next();
});

export default app;