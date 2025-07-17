export interface JwtPayload {
  sub: string; // ID пользователя
  login?: string;
  roles?: string[];
}