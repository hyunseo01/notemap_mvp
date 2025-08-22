import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { CreateUnitDto, UpdateUnitDto } from './dto/create-unit.dto';

@Injectable()
export class UnitsService {
  constructor(@InjectRepository(Unit) private repo: Repository<Unit>) {}

  async findAll() {
    const rows = await this.repo.find({ order: { createdAt: 'DESC' } });
    return rows.map(this.toDto);
  }

  async create(dto: CreateUnitDto) {
    const row = this.repo.create({ ...dto });
    return this.toDto(await this.repo.save(row));
  }

  async update(id: string, dto: UpdateUnitDto) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Unit not found');
    Object.assign(row, dto);
    return this.toDto(await this.repo.save(row));
  }

  async remove(id: string) {
    await this.repo.delete(id);
  }

  private toDto = (u: Unit) => ({
    id: u.id,
    pinId: u.pinId,
    title: u.title,
    address: u.address,
    position: { lat: Number(u.lat), lng: Number(u.lng) },
    status: u.status,
    dealStatus: u.dealStatus,
    salePrice: u.salePrice ?? undefined,
    maintenanceFee: u.maintenanceFee ?? undefined,
    priceText: u.priceText,
    options: u.options,
    optionEtc: u.optionEtc,
    unitLines: u.unitLines,
    orientations: u.orientations,
    images: u.images,
  });
}
