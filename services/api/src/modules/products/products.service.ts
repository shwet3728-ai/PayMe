import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createProduct(
    shopId: string,
    name: string,
    description: string,
    price: number,
  ) {
    const product =
      await this.prisma.product.create({
        data: {
          shopId,
          name,
          description,
          price,
        },
      });

    return {
      success: true,
      product,
    };
  }

  async getProductsByShop(
    shopId: string,
  ) {
    return this.prisma.product.findMany({
      where: {
        shopId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getProductById(
    productId: string,
  ) {
    return this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
  }
}
