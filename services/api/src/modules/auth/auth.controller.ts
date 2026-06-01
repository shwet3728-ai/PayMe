import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('send-otp')
  async sendOtp(
    @Body() dto: SendOtpDto,
  ) {
    console.log('SEND OTP DTO:', dto);

    return this.authService.sendOtp(dto.phone);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
  ) {
    return this.authService.verifyOtp(
      dto.phone,
      dto.otp,
    );
  }
}
