import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthRateLimitGuard } from '@/modules/auth/guards/auth-rate-limit.guard.js';
import { AuthService } from '@/modules/auth/services/auth.service.js';
import { DatabaseModule } from '@/infrastructure/database/database.module.js';
import { PasswordRecoveryProvider } from './providers/password-recovery.provider.js';
import { PasswordProvider } from './providers/password.provider.js';
import { RegistrationProvider } from './providers/registration.provider.js';
import { SessionProvider } from './providers/session.provider.js';
import { TokenProvider } from './providers/token.provider.js';
import { VerificationMailProvider } from './providers/verification-mail.provider.js';
import { AuthController } from './auth.controller.js';

@Module({
  imports: [DatabaseModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    RegistrationProvider,
    PasswordProvider,
    VerificationMailProvider,
    SessionProvider,
    TokenProvider,
    PasswordRecoveryProvider,
    AuthRateLimitGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
