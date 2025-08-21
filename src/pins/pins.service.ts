import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pin } from './entities/pin.entity';
import { CreatePinDto } from './dto/create-pin.dto';

@Injectable()
export class PinsService {
  constructor(@InjectRepository(Pin) private readonly repo: Repository<Pin>) {}

  create(dto: CreatePinDto) {
    const pin = this.repo.create({
      ...dto,
      // 필요 시 creatorId 등 주입
    });
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
      relations: ['units'],
      order: { units: { id: 'ASC' } as any },
    });
    if (!pin) throw new NotFoundException('Pin not found');
    return pin;
  }
}
