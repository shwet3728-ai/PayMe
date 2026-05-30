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

    const totalAmount =
      product.price * quantity;

    const order =
      await this.prisma.order.create({
        data: {
          customerId,
          shopId,
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
      order,
    };
  }

  async updateStatus(
    orderId: string,
    status: string,
  ) {
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
        createdAt: 'desc',
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
