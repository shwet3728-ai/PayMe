import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import * as QRCode from 'qrcode';

@Injectable()
export class ShopsService {
  constructor(private readonly prisma: PrismaService) {}

  async createShop(ownerId: string, name: string, description: string) {
    if (!name?.trim()) {
      return {
        success: false,
        message: 'Shop name is required',
      };
    }

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

    const shop = await this.prisma.shop.create({
      data: {
        ownerId,
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    await this.prisma.user.update({
      where: { id: ownerId },
      data: { role: UserRole.SHOP_OWNER },
    });

    return {
      success: true,
      shop,
    };
  }

  async updateShop(ownerId: string, name: string, description: string) {
    if (!name?.trim()) {
      return {
        success: false,
        message: 'Shop name is required',
      };
    }

    const shop = await this.prisma.shop.findFirst({
      where: { ownerId },
    });

    if (!shop) {
      return {
        success: false,
        message: 'Shop not found',
      };
    }

    const updatedShop = await this.prisma.shop.update({
      where: { id: shop.id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    return {
      success: true,
      shop: updatedShop,
    };
  }

  async getMyShops(ownerId: string) {
    const shop = await this.prisma.shop.findFirst({
      where: { ownerId },
    });

    return shop ? [shop] : [];
  }

  async getAllShops() {
    return this.prisma.shop.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        products: {
          where: { isAvailable: true },
        },
      },
    });
  }

  async getShopById(shopId: string) {
    return this.prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        products: true,
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getShopQr(shopId: string) {
    const customerWebUrl =
      process.env.CUSTOMER_WEB_URL || 'http://localhost:3000';
    const queueUrl = `${customerWebUrl}/shop/${shopId}/queue`;

    const qrCode = await QRCode.toDataURL(queueUrl);

    return {
      shopId,
      queueUrl,
      qrCode,
    };
  }
}
