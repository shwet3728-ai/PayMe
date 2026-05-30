import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post('create')
  createPayment(
    @Body()
    body: {
      orderId: string;
    },
  ) {
    return this.paymentsService.createPayment(
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
