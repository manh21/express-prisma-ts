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
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_strategy = exports.account_strategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_http_bearer_1 = require("passport-http-bearer");
const API_TOKEN = process.env.API_TOKEN;
function account_strategy(passport, client) {
    const { user } = client;
    const opts = {
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        secretOrKey: process.env.ACCESS_TOKEN_SECRET_KEY,
    };
    passport.use('jwt', new passport_jwt_1.Strategy(opts, function (jwt_payload, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield user.findUnique({
                    where: {
                        id: jwt_payload.id,
                    },
                    select: {
                        id: true,
                        role_id: true,
                    }
                });
                if (userData != null) {
                    return done(null, userData);
                }
                else {
                    return done(null, false);
                }
            }
            catch (error) {
                return done(error);
            }
        });
    }));
}
exports.account_strategy = account_strategy;
const api_strategy = (passport) => {
    passport.use(new passport_http_bearer_1.Strategy(function (token, done) {
        try {
            if (token !== API_TOKEN)
                return done(null, false);
            return done(null, { status: 200 }, { scope: 'all' });
        }
        catch (error) {
            return done(error);
        }
    }));
};
exports.api_strategy = api_strategy;
//# sourceMappingURL=passport.js.map