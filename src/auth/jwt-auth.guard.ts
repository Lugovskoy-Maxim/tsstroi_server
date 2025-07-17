import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  canActivate(context: ExecutionContext) {
    // Получаем текущий контекст запроса
    // const request = context.switchToHttp().getRequest();

    // Проверяем наличие и валидность JWT-токена
    return super.canActivate(context);
  }
}