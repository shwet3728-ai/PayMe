import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
const Razorpay = require('razorpay');
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(
    private readonly prisma: PrismaService,
  ) {
    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      console.warn(
        'Razorpay credentials are missing. Payment creation will fail.',
      );
    }

    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async createPayment(customerId: string, orderId: string) {
    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return {
        success: false,
        message: 'Payment gateway is not configured',
      };
    }

    const order = await this.prisma.order.findUnique({
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

    if (order.customerId !== customerId) {
      return {
        success: false,
        message: 'You cannot pay for this order',
      };
    }

    if (order.totalAmount <= 0) {
      return {
        success: false,
        message: 'Invalid order amount',
      };
    }

    const existingSuccessPayment =
      await this.prisma.payment.findUnique({
        where: { orderId },
      });

    if (existingSuccessPayment?.status === 'SUCCESS') {
      return {
        success: false,
        message: 'Order is already paid',
      };
    }

    const razorpayOrder =
      await this.razorpay.orders.create({
        amount: Math.round(order.totalAmount * 100),
        currency: 'INR',
        receipt: order.id,
      });

    const payment =
      await this.prisma.payment.upsert({
        where: {
          orderId,
        },
        update: {
          razorpayOrderId: razorpayOrder.id,
        },
        create: {
          orderId,
          amount: order.totalAmount,
          status: 'PENDING',
          razorpayOrderId: razorpayOrder.id,
        },
      });

    return {
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      payment,
    };
  }

  async verifyPayment(body: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return {
        success: false,
        message: 'Payment gateway is not configured',
      };
    }

    const generatedSignature = crypto
      .createHmac(
        'sha256',
        process.env.RAZORPAY_KEY_SECRET!,
      )
      .update(
        `${body.razorpay_order_id}|${body.razorpay_payment_id}`,
      )
      .digest('hex');

    if (
      generatedSignature !==
      body.razorpay_signature
    ) {
      return {
        success: false,
        message: 'Invalid signature',
      };
    }

    const payment = await this.prisma.payment.findFirst({
      where: {
        razorpayOrderId:
          body.razorpay_order_id,
      },
    });

    if (!payment) {
      return {
        success: false,
        message: "Payment not found",
      };
    }

    await this.prisma.payment.update({
      where: {
        orderId: payment.orderId,
      },
      data: {
        status: "SUCCESS",
        razorpayPaymentId:
          body.razorpay_payment_id,
      },
    });

    await this.prisma.order.update({
      where: {
        id: payment.orderId,
      },
      data: {
        status: 'PENDING',
      },
    });

    return {
      success: true,
    };
  }
}
