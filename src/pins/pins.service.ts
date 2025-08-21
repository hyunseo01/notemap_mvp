import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Pin } from './entities/pin.entity';
import { CreatePinDto } from './dto/create-pin.dto';

@Injectable()
export class PinsService {
  constructor(@InjectRepository(Pin) private readonly repo: Repository<Pin>) {}

  create(dto: CreatePinDto) {
    const payload: DeepPartial<Pin> = {
      ...dto,
    };
    const pin = this.repo.create(payload);
    return this.repo.save(pin);
  }

  list(limit = 50) {
    return this.repo.find({
      take: Math.min(limit, 200),
      order: { id: 'DESC' },
    });
  }

  async detail(id: string) {
    const pin = await this.repo.findOne({
      where: { id },
      relations: { units: true },
    });
    if (!pin) throw new NotFoundException('Pin not found');
    if (pin.units?.length) {
      pin.units = [...pin.units].sort((a, b) => Number(a.id) - Number(b.id));
    }
    return pin;
  }
}
