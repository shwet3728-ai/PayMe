import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createPayment(orderId: string) {
    const order =
      await this.prisma.order.findUnique({
        where: {
          id: orderId,
        },
      });

    if (!order) {
      return {
        success: false,
        message: 'Order not found',
      };
    }

    const payment =
      await this.prisma.payment.create({
        data: {
          orderId,
          amount: order.totalAmount,
          status: 'PENDING',
        },
      });

    return {
      success: true,
      payment,
    };
  }
}
