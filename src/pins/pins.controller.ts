import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PinsService } from './pins.service';
import { CreatePinDto } from './dto/create-pin.dto';

@Controller('pins')
export class PinsController {
  constructor(private readonly pinsService: PinsService) {}

  @Post()
  async create(@Body() dto: CreatePinDto) {
    const data = await this.pinsService.create(dto);
    return { success: true, message: 'Pin created', data };
  }

  @Get()
  async list(@Query('limit') limit?: string) {
    const data = await this.pinsService.list(limit ? Number(limit) : 50);
    return { success: true, message: 'Pins fetched', data };
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const data = await this.pinsService.detail(id);
    return { success: true, message: 'Pin fetched', data };
  }
}
