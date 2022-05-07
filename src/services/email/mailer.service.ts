import nodemailer from "nodemailer";
import Email from "email-templates";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { parseBool } from "../../utils/helper";

const SMTP_HOST = process.env.SMTP_HOST!;
const SMTP_PORT = Number(process.env.SMTP_PORT!) || 25;
const SMTP_USER = process.env.SMTP_USER!;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD!;
const SMTP_SECURE = parseBool(process.env.SMTP_SECURE!) || false;
const APP_NAME = process.env.APP_NAME! || "";

function createTransport() {
    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
        },
    });
}

export const sendEmailVerification = async (userData: any) => {
    const transporter = createTransport();
    const handlebarOptions = {
        viewEngine: {
            extName: '.handlebars',
            partialsDir: path.resolve('./src/views/emails/'),
            defaultLayout: '',
        },
        viewPath: path.resolve('./src/views/emails/'),
        extName: '.handlebars',
    };

    // use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions));

    const mailOptions = {
        from: `"No Reply" <notification@komikdesu.com>`, // sender address
        to: `${userData.email}`, // list of receivers
        subject: 'Email Verification', // Subject line
        template: 'email_verification', // the name of the template file i.e email.handlebars
        context:{
            name: `${userData.fullName}`,
            app_name: `${APP_NAME}`
        }
    };

    // trigger the sending of the E-mail
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};

export const sendResetPassword = async (userData: any, resetToken: string) => {
    try {
        const transport = createTransport();

        const email = new Email({
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

        await email.send({
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
    } catch (error) {
        console.error(error);
    }
};

export const sendPasswordChangeNotification = async (userData: any) => {
    try {
        const transport = createTransport();

        const email = new Email({
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

        await email.send({
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
    } catch (error) {
        console.error(error);
    }
};