import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pin } from './entities/pin.entity';
import { Unit } from '../units/entities/unit.entity';
import { CreatePinDto, UpdatePinDto } from './dto/create-pin.dto';

@Injectable()
export class PinsService {
  constructor(
    @InjectRepository(Pin) private pinRepo: Repository<Pin>,
    @InjectRepository(Unit) private unitRepo: Repository<Unit>,
  ) {}

  async findAll() {
    const rows = await this.pinRepo.find({ order: { createdAt: 'DESC' } });
    return rows.map(this.toDto);
  }

  async findOneWithLowest(id: string) {
    const pin = await this.pinRepo.findOne({ where: { id } });
    if (!pin) throw new NotFoundException('Pin not found');

    const { min } = (await this.unitRepo
      .createQueryBuilder('u')
      .select('MIN(u.salePrice)', 'min')
      .where('u.pinId = :pinId', { pinId: id })
      .getRawOne()) as { min: number | null };

    const dto: any = this.toDto(pin);
    dto.lowestSalePrice = { won: typeof min === 'number' ? Number(min) : null }; // ✅ 숫자 그대로
    return dto;
  }

  async create(dto: CreatePinDto) {
    const row = this.pinRepo.create({ ...dto });
    return this.toDto(await this.pinRepo.save(row));
  }

  async update(id: string, dto: UpdatePinDto) {
    const row = await this.pinRepo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Pin not found');
    Object.assign(row, dto);
    return this.toDto(await this.pinRepo.save(row));
  }

  async remove(id: string) {
    await this.pinRepo.delete(id);
  }

  private toDto = (p: Pin) => ({
    id: p.id,
    title: p.title,
    address: p.address,
    position: { lat: Number(p.lat), lng: Number(p.lng) },
    status: p.status,
    officePhone: p.officePhone,
    officePhone2: p.officePhone2,
    elevator: p.elevator,
    parkingType: p.parkingType,
    parkingGrade: p.parkingGrade,
    parkingStars: p.parkingStars,
    totalBuildings: p.totalBuildings,
    totalFloors: p.totalFloors,
    totalHouseholds: p.totalHouseholds,
    completionDate: p.completionDate ?? undefined,
    buildingType: p.buildingType,
    deed: p.deed,
    slopeGrade: p.slopeGrade,
    structureGrade: p.structureGrade,
    publicMemo: p.publicMemo,
    secretMemo: p.secretMemo,
    images: p.images,
  });
}
