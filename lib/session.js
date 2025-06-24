import { withIronSession } from 'next-iron-session'

export default function withSession(handler) {
    const password = process.env.SECRET_COOKIE_PASSWORD;

    if (!password || password.length < 32) {
        throw new Error("SECRET_COOKIE_PASSWORD is missing or too short (must be at least 32 characters)");
    }

    return withIronSession(handler, {
        password: password,
        cookieName: 'clm.mw',
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production',
        },
    });
}
