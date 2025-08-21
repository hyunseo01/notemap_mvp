import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';

@Controller('pins/:pinId/units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  async create(@Param('pinId') pinId: string, @Body() dto: CreateUnitDto) {
    const data = await this.unitsService.create(pinId, dto);
    return { success: true, message: 'Unit created', data };
  }

  @Get()
  async list(@Param('pinId') pinId: string) {
    const data = await this.unitsService.listByPin(pinId);
    return { success: true, message: 'Units fetched', data };
  }
}
