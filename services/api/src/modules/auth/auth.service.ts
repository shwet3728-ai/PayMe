import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async sendOtp(phone: string) {
    const otp = '123456';

    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000,
    );

    await this.prisma.otpVerification.create({
      data: {
        phone,
        otp,
        expiresAt,
      },
    });

    return {
      success: true,
      message: 'OTP sent successfully',
      otp,
    };
  }

  async verifyOtp(phone: string, otp: string) {
    const record =
      await this.prisma.otpVerification.findFirst({
        where: {
          phone,
          otp,
          verified: false,
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
        where: { phone },
      });

    if (!user) {
      user = await this.prisma.user.create({
        data: { phone },
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
