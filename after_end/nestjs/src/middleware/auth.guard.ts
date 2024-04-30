import {
  CanActivate,
  Injectable,
  ExecutionContext,
  SetMetadata,
  applyDecorators,
  createParamDecorator
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';

import { Logger } from '@app/utils/logger';
import { AuthService, LoginDetails } from '@app/services/auth.service';
import { AuthDto } from '@app/dtos/auth.dto';

import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

export enum Metadata {
  AUTH_ROUTE = 'auth_route',
  ADMIN_ROUTE = 'admin_route',
  SHARED_ROUTE = 'shared_route',
  PUBLIC_SECURITY = 'public_security',
}

export interface AuthenticatedOptions {
  admin?: true;
  isShared?: true;
}

export interface AuthRequest extends Request {
  user?: AuthDto;
}

export const Authenticated = (options: AuthenticatedOptions = {}) => {
  const decorators: MethodDecorator[] = [
    ApiBearerAuth(),
    // ApiCookieAuth(),
    // ApiSecurity(API_KEY_NAME),
    SetMetadata(Metadata.AUTH_ROUTE, true),
  ];

  if (options.admin) {
    decorators.push(AdminRoute());
  }

  // if (options.isShared) {
  //   decorators.push(SharedLinkRoute());
  // }

  return applyDecorators(...decorators);
}

export const Auth = createParamDecorator((_data, context: ExecutionContext): AuthDto => {
  return context.switchToHttp().getRequest<{ user: AuthDto }>().user;
});


@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name);

  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targets = [context.getHandler(), context.getClass()];
    const isAuthRoute = this.reflector.getAllAndOverride(Metadata.AUTH_ROUTE, targets);
    const isAdminRoute = this.reflector.getAllAndOverride(Metadata.ADMIN_ROUTE, targets);

    if (!isAuthRoute) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();

    const authDto = await this.authService.validate(request.headers, request.query as Record<string, string>);

    if (isAdminRoute && !authDto.user.isAdmin) {
      this.logger.warn(`拒绝访问, 仅限管理员路由: ${request.path}`);
      return false;
    }

    request.user = authDto;

    return true;
  }
}

export const GetLoginDetails = createParamDecorator((data, context: ExecutionContext): LoginDetails => {
  const request = context.switchToHttp().getRequest<Request>();
  const userAgent = UAParser(request.headers['user-agent']);

  return {
    clientIp: request.ip,
    isSecure: request.secure,
    deviceType: userAgent.browser.name || userAgent.device.type || (request.headers.devicemodel as string) || '',
    deviceOS: userAgent.os.name || (request.headers.devicetype as string) || '',
  };
});

export const PublicRoute = () =>
  applyDecorators(SetMetadata(Metadata.AUTH_ROUTE, false), ApiSecurity(Metadata.PUBLIC_SECURITY));
export const AdminRoute = (value = true) => SetMetadata(Metadata.ADMIN_ROUTE, value);

// export const SharedLinkRoute = () =>
//   applyDecorators(SetMetadata(Metadata.SHARED_ROUTE, true), ApiQuery({ name: 'key', type: String, required: false }));
