"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordChangeNotification = exports.sendResetPassword = exports.sendEmailVerification = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_templates_1 = __importDefault(require("email-templates"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const path_1 = __importDefault(require("path"));
const helper_1 = require("../../utils/helper");
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 25;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_SECURE = (0, helper_1.parseBool)(process.env.SMTP_SECURE) || false;
const APP_NAME = process.env.APP_NAME || "";
function createTransport() {
    return nodemailer_1.default.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
        },
    });
}
const sendEmailVerification = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = createTransport();
    const handlebarOptions = {
        viewEngine: {
            extName: '.handlebars',
            partialsDir: path_1.default.resolve('./src/views/emails/'),
            defaultLayout: '',
        },
        viewPath: path_1.default.resolve('./src/views/emails/'),
        extName: '.handlebars',
    };
    // use a template file with nodemailer
    transporter.use('compile', (0, nodemailer_express_handlebars_1.default)(handlebarOptions));
    const mailOptions = {
        from: `"No Reply" <notification@komikdesu.com>`,
        to: `${userData.email}`,
        subject: 'Email Verification',
        template: 'email_verification',
        context: {
            name: `${userData.fullName}`,
            app_name: `${APP_NAME}`
        }
    };
    // trigger the sending of the E-mail
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
});
exports.sendEmailVerification = sendEmailVerification;
const sendResetPassword = (userData, resetToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transport = createTransport();
        const email = new email_templates_1.default({
            transport: transport,
            send: true,
            message: {
                from: `support@${process.env.BASE_URL}`
            },
            views: {
                root: __dirname
            },
            preview: false
        });
        yield email.send({
            template: "passwordReset",
            message: {
                to: userData.email,
                subject: `${APP_NAME} Reset Password`
            },
            locals: {
                productName: APP_NAME,
                passwordResetUrl: `https://${process.env.BASE_URL}/reset-password?token=${resetToken}`,
                year: new Date().getFullYear(),
                baseUrl: `https://${process.env.BASE_URL}/`
            }
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.sendResetPassword = sendResetPassword;
const sendPasswordChangeNotification = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transport = createTransport();
        const email = new email_templates_1.default({
            transport: transport,
            send: true,
            message: {
                from: `support@${process.env.BASE_URL}`
            },
            views: {
                root: __dirname
            },
            preview: false
        });
        yield email.send({
            template: "passwordChangeNotification",
            message: {
                to: userData.email,
                subject: `Your password has been reset`
            },
            locals: {
                productName: APP_NAME,
                year: new Date().getFullYear(),
                baseUrl: `https://${process.env.BASE_URL}/`
            }
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.sendPasswordChangeNotification = sendPasswordChangeNotification;
//# sourceMappingURL=mailer.service.js.map