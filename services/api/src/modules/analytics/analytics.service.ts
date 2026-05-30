import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getShopAnalytics(shopId: string) {
    const orders = await this.prisma.order.findMany({
      where: { shopId },
      include: { items: true },
    });

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (sum, o) => sum + o.totalAmount,
      0,
    );

    const pendingOrders = orders.filter(
      (o) => o.status === 'PENDING',
    ).length;

    const deliveredOrders = orders.filter(
      (o) => o.status === 'DELIVERED',
    ).length;

    const productWiseSales: Record<string, number> = {};

    orders.forEach((order) => {
      order.items?.forEach((item: any) => {
        productWiseSales[item.productId] =
          (productWiseSales[item.productId] || 0) +
          item.quantity;
      });
    });

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      productWiseSales,
    };
  }
}
