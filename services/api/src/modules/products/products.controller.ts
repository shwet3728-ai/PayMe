import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createProduct(
    @Body()
    body: {
      shopId: string;
      name: string;
      description: string;
      price: number;
    },
  ) {
    return this.productsService.createProduct(
      body.shopId,
      body.name,
      body.description,
      body.price,
    );
  }

  @Get('shop/:shopId')
  getProductsByShop(
    @Param('shopId') shopId: string,
  ) {
    return this.productsService.getProductsByShop(
      shopId,
    );
  }

  @Get(':id')
  getProductById(
    @Param('id') id: string,
  ) {
    return this.productsService.getProductById(
      id,
    );
  }
}
