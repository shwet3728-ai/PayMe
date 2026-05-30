import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ShopsService } from './shops.service';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createShop(@Req() req: any, @Body() body: any) {
    return this.shopsService.createShop(
      req.user.userId,
      body.name,
      body.description,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-shops')
  getMyShops(@Req() req: any) {
    return this.shopsService.getMyShops(req.user.userId);
  }

  // 🔥 TEMP FIX: remove auth for debugging
  @Get(':id')
  async getShopById(@Param('id') id: string) {
    const shop = await this.shopsService.getShopById(id);

    if (!shop) {
      return { success: false, message: 'Shop not found' };
    }

    return shop;
  }
}
