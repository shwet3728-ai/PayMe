import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
  createProduct(@Body() body: any) {
    return this.productsService.createProduct(
      body.shopId,
      body.name,
      body.description,
      body.price,
    );
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.productsService.updateProduct(
      id,
      body.name,
      body.description,
      body.price,
    );
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  @Get('shop/:shopId')
  getProductsByShop(@Param('shopId') shopId: string) {
    return this.productsService.getProductsByShop(shopId);
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }
}
