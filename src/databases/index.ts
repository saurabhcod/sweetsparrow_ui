import { NODE_ENV, DB_URL } from '@config';
import { logger } from '@utils/logger';
import { connect, set, connection } from 'mongoose';

export const DBConnect = async () => {
  try {
    set('debug', NODE_ENV === 'development');

    connection.on('error', async (err) => {
      logger.info(`Mongo Engine is down ${NODE_ENV}`);
    });

    connection.on('connected', () => {
      logger.info(`Mongo Engine is up on ${NODE_ENV}`);
    });

    let options: any = {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
    await connect(DB_URL, options);
    return await connection;

  } catch (error) {
    logger.error("MongoDB Connection Error : ", error);
    return;
  }
};