import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createOrder(
    customerId: string,
    shopId: string,
    productId: string,
    quantity: number,
  ) {
    const product =
      await this.prisma.product.findUnique({
        where: { id: productId },
      });

    if (!product) {
      return {
        success: false,
        message: 'Product not found',
      };
    }

    const lastOrder =
      await this.prisma.order.findFirst({
        where: { shopId },
        orderBy: {
          tokenNumber: 'desc',
        },
      });

    const nextToken =
      (lastOrder?.tokenNumber || 0) + 1;

    const totalAmount =
      product.price * quantity;

    const order =
      await this.prisma.order.create({
        data: {
          customerId,
          shopId,
          tokenNumber: nextToken,
          totalAmount,
          items: {
            create: [
              {
                productId,
                quantity,
                price: product.price,
              },
            ],
          },
        },
        include: {
          items: true,
        },
      });

    return {
      success: true,
      tokenNumber: nextToken,
      order,
    };
  }

  async updateStatus(
    orderId: string,
    status: string,
  ) {
    const allowedStatuses = [
      'PENDING',
      'PREPARING',
      'READY',
      'DELIVERED',
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return {
        success: false,
        message: 'Invalid status',
      };
    }

    const order =
      await this.prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status,
        },
      });

    return {
      success: true,
      order,
    };
  }

  async getCurrentToken(
    shopId: string,
  ) {
    const order =
      await this.prisma.order.findFirst({
        where: {
          shopId,
          status: {
            not: 'DELIVERED',
          },
        },
        orderBy: {
          tokenNumber: 'asc',
        },
      });

    if (!order) {
      return {
        tokenNumber: null,
        status: 'NO_ACTIVE_ORDERS',
      };
    }

    return {
      tokenNumber: order.tokenNumber,
      status: order.status,
    };
  }

  async getShopOrders(
    shopId: string,
  ) {
    return this.prisma.order.findMany({
      where: {
        shopId,
      },
      include: {
        items: true,
      },
      orderBy: {
        tokenNumber: 'asc',
      },
    });
  }

  async getMyOrders(
    customerId: string,
  ) {
    return this.prisma.order.findMany({
      where: {
        customerId,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
