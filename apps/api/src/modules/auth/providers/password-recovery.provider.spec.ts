import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@/infrastructure/database/prisma.service.js';
import { PasswordProvider } from './password.provider.js';
import { PasswordRecoveryProvider } from './password-recovery.provider.js';
import { TokenProvider } from './token.provider.js';
import { VerificationMailProvider } from './verification-mail.provider.js';

describe('PasswordRecoveryProvider', () => {
  const tx = {
    $queryRaw: vi.fn(),
    passwordResetToken: { findUnique: vi.fn(), updateMany: vi.fn() },
    passwordCredential: { update: vi.fn() },
    authSession: { updateMany: vi.fn() },
  };
  const db = {
    $transaction: vi.fn(async (callback: (transaction: typeof tx) => Promise<void>) =>
      callback(tx),
    ),
  };
  const passwords = { hash: vi.fn() };
  const tokens = { hash: vi.fn() };
  let service: PasswordRecoveryProvider;

  beforeEach(async () => {
    vi.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        PasswordRecoveryProvider,
        { provide: PrismaService, useValue: { client: db } },
        { provide: PasswordProvider, useValue: passwords },
        { provide: TokenProvider, useValue: tokens },
        { provide: VerificationMailProvider, useValue: {} },
      ],
    }).compile();
    service = module.get(PasswordRecoveryProvider);
    passwords.hash.mockResolvedValue('new-hash');
    tokens.hash.mockReturnValue('token-hash');
    tx.passwordResetToken.findUnique.mockResolvedValue({ userId: 'user-id' });
  });

  it('consumes reset links, updates the password and revokes sessions', async () => {
    tx.passwordResetToken.updateMany.mockResolvedValue({ count: 1 });
    await service.resetPassword({ token: 'token', password: 'new-password' });
    expect(tx.passwordCredential.update).toHaveBeenCalledWith({
      where: { userId: 'user-id' },
      data: { passwordHash: 'new-hash', passwordChangedAt: expect.any(Date) },
    });
    expect(tx.passwordResetToken.updateMany).toHaveBeenCalledTimes(2);
    expect(tx.authSession.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-id', revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
  });

  it('rejects a consumed or expired reset token without changing credentials', async () => {
    tx.passwordResetToken.updateMany.mockResolvedValue({ count: 0 });
    await expect(
      service.resetPassword({ token: 'token', password: 'new-password' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(tx.passwordCredential.update).not.toHaveBeenCalled();
    expect(tx.authSession.updateMany).not.toHaveBeenCalled();
  });
});
