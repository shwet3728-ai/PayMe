import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createProduct(
    ownerId: string,
    shopId: string,
    name: string,
    description: string,
    price: number,
  ) {
    const shop = await this.prisma.shop.findFirst({
      where: { id: shopId, ownerId },
    });

    if (!shop) {
      return {
        success: false,
        message: 'Shop not found for this owner',
      };
    }

    if (!name || !price || price <= 0) {
      return {
        success: false,
        message: 'Name and valid price are required',
      };
    }

    return {
      success: true,
      product: await this.prisma.product.create({
        data: { shopId, name, description, price },
      }),
    };
  }

  async updateProduct(
    ownerId: string,
    productId: string,
    name: string,
    description: string,
    price: number,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true },
    });

    if (!product || product.shop.ownerId !== ownerId) {
      return {
        success: false,
        message: 'Product not found for this owner',
      };
    }

    return {
      success: true,
      product: await this.prisma.product.update({
        where: { id: productId },
        data: { name, description, price },
      }),
    };
  }

  async deleteProduct(ownerId: string, productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true },
    });

    if (!product || product.shop.ownerId !== ownerId) {
      return {
        success: false,
        message: 'Product not found for this owner',
      };
    }

    await this.prisma.product.update({
      where: { id: productId },
      data: { isAvailable: false },
    });

    return { success: true };
  }

  async getProductsByShop(shopId: string) {
    return this.prisma.product.findMany({
      where: { shopId, isAvailable: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProductById(productId: string) {
    return this.prisma.product.findUnique({
      where: { id: productId },
    });
  }
}
