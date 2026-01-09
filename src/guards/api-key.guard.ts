import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // ✅ Bypass API key for AdminJS routes
    if (request.originalUrl.startsWith('/tasks')) {
      return true;
    }

    const apiKey = request.headers['x-api-key']; // Client must send API key in header
    const validKey = this.configService.get<string>('API_KEY');

    if (apiKey && apiKey === validKey) {
      return true;
    }

    throw new UnauthorizedException('Invalid API Key');
  }
}




