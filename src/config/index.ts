import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const {
    NODE_ENV,
    PORT,
    DB_URL,
    SECRET_KEY,
    LOG_FORMAT,
    LOG_DIR,
    ORIGIN,
    JWT_EXPIRES_IN,
    ADMIN_SECRET_KEY,
    STRIPE_SECRET,
    HOST,
    SERVICE,
    EMAIL_PORT,
    SECURE,
    USER,
    PASS
} = process.env;
