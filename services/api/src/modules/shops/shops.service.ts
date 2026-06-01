import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ShopsService {
  constructor(private readonly prisma: PrismaService) {}

  async createShop(ownerId: string, name: string, description: string) {
    const existingShop = await this.prisma.shop.findFirst({
      where: { ownerId },
    });

    if (existingShop) {
      return {
        success: false,
        message: 'User already has a shop',
        shop: existingShop,
      };
    }

    return this.prisma.shop.create({
      data: {
        ownerId,
        name,
        description,
      },
    });
  }

  async getMyShops(ownerId: string) {
    const shop = await this.prisma.shop.findFirst({
      where: { ownerId },
    });

    return shop ? [shop] : [];
  }

  async getShopById(shopId: string) {
    return this.prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        products: true,
      },
    });
  }
}
