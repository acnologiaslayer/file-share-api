import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import cron from 'node-cron';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes';
import Database from './config/database';
import ErrorHandler from './middlewares/error.middleware';
import Logger from './config/logger';

import fileUtils from './utils/file.util';

class App {
  public app: Application;
  public host: string | number;
  public port: string | number;
  public api_version: string | number;
  public env: boolean;
  private db = new Database();
  private logStream = Logger.logStream;
  private logger = Logger.logger;
  public errorHandler = new ErrorHandler();

  constructor() {
    this.app = express();
    this.host = process.env.APP_HOST;
    this.port = process.env.APP_PORT;
    this.api_version = process.env.API_VERSION;

    this.initializeMiddleWares();
    this.initializeRoutes();
    this.initializeDatabase();
    this.initializeErrorHandlers();
    this.initializeCleanup();
    this.initializeStoreDirectory();
    this.startApp();
  }

  public initializeMiddleWares(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(morgan('combined', { stream: this.logStream }));
    this.app.set('json spaces', 2)
  }

  public initializeDatabase(): void {
    this.db.initializeDatabase();
  }

  public initializeRoutes(): void {
    this.app.use(`/api/${this.api_version}`, routes());
  }

  public initializeErrorHandlers(): void {
    this.app.use(this.errorHandler.appErrorHandler);
    this.app.use(this.errorHandler.genericErrorHandler);
    this.app.use(this.errorHandler.notFound);
  }

  public initializeCleanup(): void {
    cron.schedule('* * * * *', () => {
      fileUtils.cleanUp();
    });
  }

  public initializeStoreDirectory(): void {
    if(!fs.existsSync(process.env.FOLDER)){
      fs.mkdirSync(process.env.FOLDER);
      this.logger.info(`Directory Created at ${process.env.FOLDER}`);
    } else {
      this.logger.info(`Directory Exists at ${process.env.FOLDER}`)
    }
  }

  public startApp(): void {
    this.app.listen(this.port, () => {
      this.logger.info(
        `Server started at ${this.host}:${this.port}/api/${this.api_version}/`
      );
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

const app = new App();

export default app;
