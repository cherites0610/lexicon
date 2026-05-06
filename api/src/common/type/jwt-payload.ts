export interface JwtPayload {
  jti: string;
  sub: string
  email: string;
  iat?: number;
  exp?: number;
}
