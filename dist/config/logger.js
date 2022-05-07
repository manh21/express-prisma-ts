"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMorgan = exports.Logger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const morgan_1 = __importDefault(require("morgan"));
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
winston_1.default.addColors(colors);
const formatConsole = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
const formatFile = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
const httpFilter = winston_1.default.format((info) => {
    return info.level === 'http' ? info : false;
});
const infotAndWarnFilter = winston_1.default.format((info) => {
    return info.level === 'info' || info.level === 'warn' ? info : false;
});
const transports = [
    new winston_1.default.transports.Console({ format: formatConsole }),
    new winston_daily_rotate_file_1.default({
        filename: "logs/http-%DATE%.log",
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '128m',
        maxFiles: '30d',
        level: 'http',
        format: winston_1.default.format.combine(httpFilter(), formatFile),
        handleExceptions: true,
    }),
    new winston_daily_rotate_file_1.default({
        filename: 'logs/info-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '128m',
        maxFiles: '30d',
        level: 'info',
        format: winston_1.default.format.combine(infotAndWarnFilter(), formatFile)
    }),
    new winston_daily_rotate_file_1.default({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '128m',
        maxFiles: '30d',
        level: 'error',
        format: formatFile
    }),
    new winston_daily_rotate_file_1.default({
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
    write: (message) => exports.Logger.http(message.substring(0, message.lastIndexOf('\n')))
};
const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};
exports.Logger = winston_1.default.createLogger({
    level: level(),
    levels,
    transports,
});
// Build the morgan middleware
exports.loggerMorgan = (0, morgan_1.default)(':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms ":referrer" ":user-agent"', { stream, skip });
//# sourceMappingURL=logger.js.map