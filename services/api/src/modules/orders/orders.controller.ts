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

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.ordersService.updateStatus(
      id,
      body.status,
    );
  }

  @Get('shop/:shopId')
  getShopOrders(
    @Param('shopId') shopId: string,
  ) {
    return this.ordersService.getShopOrders(
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
