import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { EmailDeliveryProvider } from '@/infrastructure/mail/email-delivery.provider.js';

const webConfigSchema = z.object({
  WEB_BASE_URL: z.url().refine((value) => {
    const url = new URL(value);
    return (
      (url.protocol === 'https:' ||
        (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) &&
      !url.username &&
      !url.password &&
      url.pathname === '/' &&
      !url.search &&
      !url.hash
    );
  }),
});

@Injectable()
export class VerificationMailProvider {
  constructor(
    private readonly config: ConfigService,
    private readonly emailDelivery: EmailDeliveryProvider,
  ) {}

  assertReady(): void {
    this.webBaseUrl();
    this.emailDelivery.assertReady();
  }

  async send(email: string, token?: string): Promise<void> {
    const url = new URL('/verify-email', this.webBaseUrl());
    if (token) url.searchParams.set('token', token);
    const text = token
      ? `Confirm your email address by opening this link: ${url.toString()}\n\nThis link expires in 24 hours.`
      : 'An attempt was made to register this email address. If this was not you, no action is required.';

    await this.emailDelivery.send({ to: email, subject: 'Your RozgarLocal account', text });
  }

  async sendPasswordReset(email: string, token?: string): Promise<void> {
    const url = new URL('/reset-password', this.webBaseUrl());
    if (token) url.searchParams.set('token', token);
    const text = token
      ? `Reset your password by opening this link: ${url.toString()}\n\nThis link expires in 30 minutes. If you did not request it, ignore this email.`
      : 'A password reset was requested for this email address. If this was not you, no action is required.';

    await this.emailDelivery.send({ to: email, subject: 'Your RozgarLocal password reset', text });
  }

  private webBaseUrl(): string {
    const result = webConfigSchema.safeParse({ WEB_BASE_URL: this.config.get('WEB_BASE_URL') });
    if (!result.success) {
      throw new ServiceUnavailableException('Authentication is temporarily unavailable');
    }
    return result.data.WEB_BASE_URL;
  }
}
