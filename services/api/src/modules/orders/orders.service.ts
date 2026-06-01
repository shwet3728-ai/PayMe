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

    if (product.shopId !== shopId || !product.isAvailable) {
      return {
        success: false,
        message: 'Product is not available for this shop',
      };
    }

    if (!quantity || quantity < 1) {
      return {
        success: false,
        message: 'Quantity must be at least 1',
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
    ownerId: string,
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

    const existingOrder =
      await this.prisma.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          shop: true,
        },
      });

    if (!existingOrder) {
      return {
        success: false,
        message: 'Order not found',
      };
    }

    if (existingOrder.shop.ownerId !== ownerId) {
      return {
        success: false,
        message: 'You cannot update this order',
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

  async getPublicQueue(
    shopId: string,
  ) {
    return this.prisma.order.findMany({
      where: {
        shopId,
        status: {
          not: 'DELIVERED',
        },
      },
      select: {
        tokenNumber: true,
        status: true,
      },
      orderBy: {
        tokenNumber: 'asc',
      },
    });
  }

  async getShopOrders(
    ownerId: string,
    shopId: string,
  ) {
    const shop = await this.prisma.shop.findFirst({
      where: { id: shopId, ownerId },
    });

    if (!shop) {
      return [];
    }

    return this.prisma.order.findMany({
      where: {
        shopId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
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
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
