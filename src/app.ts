import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN } from '@config';
import { DBConnect } from '@databases';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { isJsonString } from './utils/util';
import path from 'path';
import fs from 'fs';
import { baseDirs } from './utils/constants';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public routes: Routes[];

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;
    this.routes = routes;
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      this.connectToDatabase();
      logger.info(`=================================`);

      this.ensureDirectoriesExist(baseDirs);
      this.initializeMiddlewares();
      this.initializeRoutes(this.routes);
      this.initializeSwagger();
      this.initializeErrorHandling();
    });
  }

  private ensureDirectoriesExist(directories: string[]) {
    directories.forEach(dir => {
      const fullPath = path.join(__dirname, '..', dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created directory: ${fullPath}`);
      }
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    await DBConnect();
  }

  private initializeMiddlewares() {
    let whitelist: Array<string> = ["*"]
    if (isJsonString(ORIGIN)) {
      if (Array.isArray(JSON.parse(ORIGIN))) {
        whitelist = JSON.parse(ORIGIN);
      } else {
        whitelist = [JSON.parse(ORIGIN)];
      }
    }
    const corsOptions = {
      origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || whitelist.includes("*")) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      }
    }
    this.app.use(express.static('public'));
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors(corsOptions));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.text());
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
