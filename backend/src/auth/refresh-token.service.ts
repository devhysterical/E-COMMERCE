import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenService {
  private readonly REFRESH_TOKEN_EXPIRY_DAYS = 7;

  constructor(private prisma: PrismaService) {}

  async createRefreshToken(userId: string): Promise<string> {
    // Xóa tất cả refresh tokens cũ của user (token rotation)
    await this.prisma.refreshToken.deleteMany({ where: { userId } });

    const rawToken = randomUUID();
    const hashedToken = await bcrypt.hash(rawToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRY_DAYS);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: hashedToken,
        expiresAt,
      },
    });

    return rawToken;
  }

  async validateRefreshToken(
    rawToken: string,
  ): Promise<{ userId: string } | null> {
    // Tìm tất cả refresh tokens chưa hết hạn
    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        expiresAt: { gt: new Date() },
      },
    });

    for (const tokenRecord of tokens) {
      const isMatch = await bcrypt.compare(rawToken, tokenRecord.token);
      if (isMatch) {
        return { userId: tokenRecord.userId };
      }
    }

    return null;
  }

  async revokeUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
