import { Router, Request, Response, NextFunction, Express } from 'express';
import { NodeCacheService } from 'src/infra/cache';
import { AxiosHttpClient } from 'src/infra/http';
import { PinoLogger } from 'src/infra/logger';
import { AuthManager } from './auth-manager';
import { JwtSecrets } from './types';
import uniqid from 'uniqid';
import jwt from 'jsonwebtoken';

export function createAuthRoutes(app: Express) {
  const secrets: JwtSecrets = {
    secret: process.env.JWT_SECRET ?? uniqid(),
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? uniqid(),
  };

  const loggerLevel = process.env.LOGGER_LEVEL ?? 'info';
  const logger = new PinoLogger(loggerLevel, 'AUTH');

  const cache = new NodeCacheService();
  const httpClient = new AxiosHttpClient('http://localhost:8081', logger);
  const authManager = new AuthManager(secrets, cache, httpClient, logger);

  const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const uncheckedRoutes = ['/login', '/refresh-token'];

    if (uncheckedRoutes.includes(req.path)) {
      next();
    } else {
      let token = req.headers['x-access-token'] as string;

      try {
        const decoded = jwt.verify(token, secrets.secret) as jwt.JwtPayload;

        if (!decoded.id || !authManager.auth(decoded.id)) {
          res.sendStatus(403);
        } else {
          req.id = decoded.id;
          next();
        }
      } catch (error) {
        res.sendStatus(401);
      }
    }
  };

  app.use(authMiddleware);

  app.post('/login', async (req: Request, res: Response) => {
    const { user, password } = req.body ?? {};

    if (!user || !password) {
      res.status(400).json({ message: 'Invalid credentials' });
    } else {
      const loginResult = await authManager.login(user, password);

      if (!loginResult.success) {
        res.status(401).json(loginResult.error ?? {});
      } else {
        res.status(201).json(loginResult.token);
      }
    }
  });

  app.post('/refresh-token', async (req: Request, res: Response) => {
    const { refreshToken } = req.body ?? {};

    const decoded = jwt.verify(
      refreshToken,
      secrets.refreshSecret,
    ) as jwt.JwtPayload;

    if (!decoded.id || !authManager.auth(decoded.id)) {
      res.sendStatus(403);
    } else {
      const loginResult = await authManager.refresh(decoded.id);

      if (!loginResult.success) {
        res.status(401).json(loginResult.error ?? {});
      } else {
        res.status(201).json(loginResult.token);
      }
    }
  });

  app.delete('/logout', async (req: Request, res: Response) => {
    authManager.logout(req.id);
    res.status(204).json();
  });
}
