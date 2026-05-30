import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ShopsService } from './shops.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('shops')
export class ShopsController {
  constructor(
    private readonly shopsService: ShopsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createShop(
    @Req() req: any,
    @Body()
    body: {
      name: string;
      description?: string;
    },
  ) {
    return this.shopsService.createShop(
      req.user.userId,
      body.name,
      body.description,
    );
  }

  @Get()
  getAllShops() {
    return this.shopsService.getAllShops();
  }

  @Get(':id')
  getShopById(
    @Param('id') id: string,
  ) {
    return this.shopsService.getShopById(id);
  }
}
