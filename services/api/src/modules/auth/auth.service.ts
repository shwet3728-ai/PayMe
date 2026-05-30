import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
constructor(private readonly prisma: PrismaService) {}

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
  where: {
    id: record.id,
  },
  data: {
    verified: true,
  },
});

return {
  success: true,
  message: 'OTP verified',
};


}
}
