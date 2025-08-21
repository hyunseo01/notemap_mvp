import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PinsService } from './pins.service';
import { CreatePinDto } from './dto/create-pin.dto';

@Controller('pins')
export class PinsController {
  constructor(private readonly pinsService: PinsService) {}

  @Post()
  async create(@Body() dto: CreatePinDto) {
    const data = await this.pinsService.create(dto);
    return { success: true, message: '핀 생성됨', data };
  }

  @Get()
  async list(@Query('limit') limit?: string) {
    const data = await this.pinsService.list(limit ? Number(limit) : 50);
    return { success: true, message: '핀전체 조회됨', data };
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const data = await this.pinsService.detail(id);
    return { success: true, message: '개별핀 조회됨', data };
  }
}
