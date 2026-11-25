import { ConfigService } from '@nestjs/config';
import { ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { VerificationMailProvider } from './verification-mail.provider.js';

describe('VerificationMailProvider', () => {
  let service: VerificationMailProvider;

  beforeEach(async () => {
    const settings: Record<string, string> = {
      RESEND_API_KEY: 'test-key',
      AUTH_MAIL_FROM: 'test@example.com',
      WEB_BASE_URL: 'http://localhost:3000',
    };
    const module = await Test.createTestingModule({
      providers: [
        VerificationMailProvider,
        { provide: ConfigService, useValue: { get: (name: string) => settings[name] } },
      ],
    }).compile();
    service = module.get(VerificationMailProvider);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends a link to the configured web origin', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    await service.send('user@example.com', 'test-token');
    const [, options] = fetchMock.mock.calls[0];
    expect(JSON.parse(options.body)).toMatchObject({
      to: ['user@example.com'],
      text: expect.stringContaining('http://localhost:3000/verify-email?token=test-token'),
    });
  });

  it('surfaces delivery failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    await expect(service.send('user@example.com', 'test-token')).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
