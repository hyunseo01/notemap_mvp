import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PinsService } from './pins.service';
import { CreatePinDto } from './dto/create-pin.dto';
import { UpdatePinDto } from './dto/update-pin.dto';

@Controller('pins')
export class PinsController {
  constructor(private readonly service: PinsService) {}

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return { success: true, message: 'ok', data };
  }

  /** 핀 상세 + 매물 요약(unitsSummary) 포함 */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(id);
    return { success: true, message: 'ok', data };
  }

  @Post()
  async create(@Body() dto: CreatePinDto) {
    const data = await this.service.create(dto);
    return { success: true, message: 'created', data };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePinDto) {
    const data = await this.service.update(id, dto);
    return { success: true, message: 'updated', data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.service.remove(id);
    return { success: true, message: 'removed', data };
  }
}
