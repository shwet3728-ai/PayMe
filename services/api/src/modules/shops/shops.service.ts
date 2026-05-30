import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ShopsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createShop(
    ownerId: string,
    name: string,
    description?: string,
  ) {
    const shop =
      await this.prisma.shop.create({
        data: {
          ownerId,
          name,
          description,
        },
      });

    return {
      success: true,
      shop,
    };
  }

  async getAllShops() {
    return this.prisma.shop.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getShopById(
    shopId: string,
  ) {
    return this.prisma.shop.findUnique({
      where: {
        id: shopId,
      },
      include: {
        products: true,
      },
    });
  }
}
