"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = require("./config/logger");
const http_errors_1 = __importDefault(require("http-errors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const app = (0, express_1.default)();
// Route File
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const default_route_1 = __importDefault(require("./routes/default.route"));
// Express extension
app.use(logger_1.loggerMorgan);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)(process.env.COOKIES_SECRET));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use((0, compression_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: function (_origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        return callback(null, true);
    }
}));
// Static Files
app.use('/content', express_1.default.static(path_1.default.resolve(__dirname, './../public')));
// Rate Limit
// app.set('trust proxy', 1);
// app.use(rateLimiter.global());
// Register Route
app.use('/api/v1', index_routes_1.default);
app.use(default_route_1.default);
// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
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
            logger_1.Logger.error(err.error.stack);
            break;
        case 'warn':
            logger_1.Logger.warn(err.warn);
            break;
        case 'info':
            logger_1.Logger.info(err.info);
            break;
        case 'debug':
            logger_1.Logger.debug(err.debug);
            break;
        default:
            break;
    }
    res.status(err.status || 500);
    res.send(content);
    next();
});
exports.default = app;
//# sourceMappingURL=app.js.map