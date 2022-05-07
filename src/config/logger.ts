import winston from "winston";
import DailyRotateFile from 'winston-daily-rotate-file';
import { Response, Request } from "express";
import morgan from "morgan";

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'http';
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

const formatConsole = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
);

const formatFile = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
);

const httpFilter = winston.format((info) => {
    return info.level === 'http' ? info : false;
});

const infotAndWarnFilter = winston.format((info) => {
    return info.level === 'info' || info.level === 'warn' ? info : false;
});

const transports: Array<any> = [
    new winston.transports.Console({format: formatConsole}),
    new DailyRotateFile({
        filename: "logs/http-%DATE%.log",
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '128m',
        maxFiles: '30d',
        level: 'http',
        format: winston.format.combine(
            httpFilter(),
            formatFile
        ),
        handleExceptions: true,
    }),
    new DailyRotateFile({
        filename: 'logs/info-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '128m',
        maxFiles: '30d',
        level: 'info',
        format: winston.format.combine(
            infotAndWarnFilter(),
            formatFile
        )
    }),
    new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '128m',
        maxFiles: '30d',
        level: 'error',
        format: formatFile
    }),
    new DailyRotateFile({
        filename: 'logs/all-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '128m',
        maxFiles: '30d',
        format: formatFile
    }),
];

// Override the stream method by telling
const stream = {
    // Use the http severity
    write: (message: any) => Logger.http(message.substring(0, message.lastIndexOf('\n')))
};

const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};

export const Logger = winston.createLogger({
    level: level(),
    levels,
    transports,
});

// Build the morgan middleware
export const loggerMorgan = morgan<Request, Response>(
    ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms ":referrer" ":user-agent"',
    { stream, skip }
);
