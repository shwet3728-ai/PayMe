import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
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
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.productsService.createProduct(
      req.user.userId,
      body.shopId,
      body.name,
      body.description,
      body.price,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateProduct(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.productsService.updateProduct(
      req.user.userId,
      id,
      body.name,
      body.description,
      body.price,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteProduct(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.productsService.deleteProduct(
      req.user.userId,
      id,
    );
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
