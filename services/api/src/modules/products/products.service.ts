import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createProduct(shopId: string, name: string, description: string, price: number) {
    return {
      success: true,
      product: await this.prisma.product.create({
        data: { shopId, name, description, price },
      }),
    };
  }

  async updateProduct(productId: string, name: string, description: string, price: number) {
    return {
      success: true,
      product: await this.prisma.product.update({
        where: { id: productId },
        data: { name, description, price },
      }),
    };
  }

  async deleteProduct(productId: string) {
    await this.prisma.product.delete({
      where: { id: productId },
    });

    return { success: true };
  }

  async getProductsByShop(shopId: string) {
    return this.prisma.product.findMany({
      where: { shopId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProductById(productId: string) {
    return this.prisma.product.findUnique({
      where: { id: productId },
    });
  }
}
