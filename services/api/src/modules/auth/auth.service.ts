import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async sendOtp(phone: string) {
    const normalizedPhone = phone.trim();
    const otp = String(randomInt(100000, 1000000));

    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000,
    );

    await this.prisma.otpVerification.create({
      data: {
        phone: normalizedPhone,
        otp,
        expiresAt,
      },
    });

    return {
      success: true,
      message: 'OTP sent successfully',
      otp:
        process.env.NODE_ENV === 'production' && process.env.OTP_DEBUG !== 'true'
          ? undefined
          : otp,
    };
  }

  async verifyOtp(phone: string, otp: string) {
    const normalizedPhone = phone.trim();

    const record =
      await this.prisma.otpVerification.findFirst({
        where: {
          phone: normalizedPhone,
          otp,
          verified: false,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    if (!record) {
      return {
        success: false,
        message: 'Invalid OTP',
      };
    }

    await this.prisma.otpVerification.update({
      where: { id: record.id },
      data: { verified: true },
    });

    let user =
      await this.prisma.user.findUnique({
        where: { phone: normalizedPhone },
      });

    if (!user) {
      user = await this.prisma.user.create({
        data: { phone: normalizedPhone },
      });
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      phone: user.phone,
      role: user.role,
    });

    return {
      success: true,
      accessToken,
      user,
    };
  }
}
