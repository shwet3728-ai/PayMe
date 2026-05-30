import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('shop/:shopId')
  getShopAnalytics(@Param('shopId') shopId: string) {
    return this.analyticsService.getShopAnalytics(shopId);
  }
}
