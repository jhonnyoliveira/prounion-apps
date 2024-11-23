import compression from 'compression';
import cors from 'cors';
import express, { Express, Router } from 'express';
import helmet from 'helmet';
import { Logger } from './logger';

export class HttpServer {
  private app: Express;

  constructor(private logger: Logger) {
    this.app = express();
    this.logger.setPrefix('HTTP SERVER');
  }

  async start(port: number): Promise<void> {
    this.logger.info('Starting...');
    this.loadMiddlewares();
    this.loadRoutes();
    this.app.listen(port, () => this.logger.info(`Running on port ${port}`));
  }

  async stop(): Promise<void> {
    this.logger.info('Stopping...');
  }

  private loadMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(compression());
    this.app.use(cors());
  }

  private async loadRoutes(): Promise<void> {
    const router = Router();
    this.app.use(router);
  }
}
