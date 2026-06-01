import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createPayment(
    @Req() req: any,
    @Body()
    body: {
      orderId: string;
    },
  ) {
    return this.paymentsService.createPayment(
      req.user.userId,
      body.orderId,
    );
  }

  @Post('verify')
  verifyPayment(
    @Body()
    body: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    },
  ) {
    return this.paymentsService.verifyPayment(body);
  }
}
