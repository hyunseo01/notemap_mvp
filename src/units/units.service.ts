import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { Pin } from '../pins/entities/pin.entity';
import { CreateUnitDto } from './dto/create-unit.dto';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit) private readonly units: Repository<Unit>,
    @InjectRepository(Pin) private readonly pins: Repository<Pin>,
  ) {}

  async create(pinId: string, dto: CreateUnitDto) {
    const pin = await this.pins.findOne({ where: { id: pinId } });
    if (!pin) throw new NotFoundException('Pin not found');

    const unit = this.units.create({ ...dto, pinId });
    return this.units.save(unit);
  }

  async listByPin(pinId: string) {
    const pin = await this.pins.findOne({ where: { id: pinId } });
    if (!pin) throw new NotFoundException('Pin not found');

    return this.units.find({ where: { pinId }, order: { id: 'ASC' } });
  }
}
