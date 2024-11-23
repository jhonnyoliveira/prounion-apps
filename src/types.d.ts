declare namespace Express {
  export interface Request {
    id: string;
  }

  export interface JwtPayload {
    id: string;
  }
}
