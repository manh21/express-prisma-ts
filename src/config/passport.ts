import { PrismaClient } from '@prisma/client';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as BearerStrategy } from 'passport-http-bearer';

const API_TOKEN = process.env.API_TOKEN!;

export function account_strategy (passport: any, client: PrismaClient) {
    const { user } = client as PrismaClient;

    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        secretOrKey: process.env.ACCESS_TOKEN_SECRET_KEY,
    };

    passport.use('jwt', new JwtStrategy(opts, async function(jwt_payload, done) {
        try {
            const userData = await user.findUnique({
                where: {
                    id: jwt_payload.id,
                },
                select: {
                    id: true,
                    role_id: true,
                }
            });

            if(userData != null) {
                return done(null, userData);
            } else {
                return done(null, false);
            }

        } catch (error) {
            return done(error);
        }
    }));
}

export const api_strategy = (passport: any) => {
    passport.use(new BearerStrategy(function(token: string, done: any) {
        try {
            if (token !== API_TOKEN) return done(null, false);
            return done(null, { status: 200 }, { scope: 'all' });
        } catch (error) {
            return done(error);
        }
    }));
};