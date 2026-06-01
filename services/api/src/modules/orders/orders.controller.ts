import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createOrder(
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.ordersService.createOrder(
      req.user.userId,
      body.shopId,
      body.productId,
      body.quantity,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.ordersService.updateStatus(
      req.user.userId,
      id,
      body.status,
    );
  }

  @Get('shop/:shopId/current')
  getCurrentToken(
    @Param('shopId') shopId: string,
  ) {
    return this.ordersService.getCurrentToken(
      shopId,
    );
  }

  @Get('shop/:shopId/queue')
  getPublicQueue(
    @Param('shopId') shopId: string,
  ) {
    return this.ordersService.getPublicQueue(
      shopId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('shop/:shopId')
  getShopOrders(
    @Req() req: any,
    @Param('shopId') shopId: string,
  ) {
    return this.ordersService.getShopOrders(
      req.user.userId,
      shopId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  getMyOrders(
    @Req() req: any,
  ) {
    return this.ordersService.getMyOrders(
      req.user.userId,
    );
  }
}
