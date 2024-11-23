export type LoginResult = {
  success: boolean;
  token?: Token;
  error?: string;
};

export type Token = {
  token: string;
  refreshToken: string;
};

export type LoginServiceResponse = {
  id: number;
};

export type JwtSecrets = {
  secret: string;
  refreshSecret: string;
};

export type UserSessionData = {
  userId: number;
  tokenId: string;
  refreshTokenId: string;
};
