import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PinsService } from './pins.service';
import { CreatePinDto } from './dto/create-pin.dto';
import { UpdatePinDto } from './dto/update-pin.dto';

@Controller('pins')
export class PinsController {
  constructor(private readonly service: PinsService) {}

  // 목록
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 상세 (+ 최저가 포함)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOneWithLowest(id);
  }

  // 생성
  @Post()
  create(@Body() dto: CreatePinDto) {
    return this.service.create(dto);
  }

  // 수정
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePinDto) {
    return this.service.update(id, dto);
  }

  // 삭제
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { ok: true };
  }
}
