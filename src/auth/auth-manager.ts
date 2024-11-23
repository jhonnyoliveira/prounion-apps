import jwt from 'jsonwebtoken';
import { CacheService } from 'src/infra/cache';
import { HttpClient } from 'src/infra/http';
import { Logger } from 'src/infra/logger';
import uniqid from 'uniqid';
import {
  JwtSecrets,
  LoginResult,
  LoginServiceResponse,
  UserSessionData,
} from './types';

export class AuthManager {
  constructor(
    private secrets: JwtSecrets,
    private cache: CacheService,
    private httpClient: HttpClient,
    private logger: Logger,
  ) {}

  async login(user: string, password: string): Promise<LoginResult> {
    try {
      const data = await this.httpClient.post<LoginServiceResponse>('/login', {
        user,
        password,
      });

      return this.generateSession(data.id);
    } catch (error) {
      this.logger.error(error, `login attempt for the user ${user}`);
      return {
        success: false,
        error: 'Login failure',
      };
    }
  }

  logout(tokenIdOrRefreshTokenId: string): void {
    if (!this.cache.has(tokenIdOrRefreshTokenId)) {
      return;
    }

    const sessionData = this.cache.get(
      tokenIdOrRefreshTokenId,
    ) as UserSessionData;

    this.cache.del(sessionData.tokenId);
    this.cache.del(sessionData.refreshTokenId);
  }

  refresh(refreshTokenId: string): LoginResult {
    if (!this.cache.has(refreshTokenId)) {
      return {
        success: false,
        error: 'Invalid refresh token',
      };
    }

    const sessionData = this.cache.get(refreshTokenId) as UserSessionData;
    return this.generateSession(sessionData.userId);
  }

  auth(tokenId: string): number {
    if (!this.cache.has(tokenId)) {
      return 0;
    }

    const sessionData = this.cache.get(tokenId) as UserSessionData;
    return sessionData.userId;
  }

  private generateSession(userId: number): LoginResult {
    const tokenId = uniqid();
    const refreshTokenId = uniqid();
    const token = this.generateToken(this.secrets.secret, 120, tokenId);
    const refreshToken = this.generateToken(
      this.secrets.refreshSecret,
      600,
      refreshTokenId,
    );

    const sessionData: UserSessionData = {
      userId,
      tokenId,
      refreshTokenId,
    };

    this.cache.set(tokenId, sessionData, 120);
    this.cache.set(refreshTokenId, sessionData, 600);

    const result: LoginResult = {
      success: true,
      token: {
        token,
        refreshToken,
      },
    };

    return result;
  }

  private generateToken(
    secret: string,
    minutesToExpire: number,
    id: string,
  ): string {
    return jwt.sign({ id }, secret, {
      expiresIn: `${minutesToExpire}m`,
    });
  }
}
