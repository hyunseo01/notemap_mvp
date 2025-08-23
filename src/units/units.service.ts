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

  async findOne(id: string) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('unit not found');

    return {
      success: true,
      message: 'ok',
      data: this.toDto(u),
    };
  }

  private packRange(
    min?: number | null,
    max?: number | null,
  ): string | undefined {
    const hasMin = min !== undefined && min !== null;
    const hasMax = max !== undefined && max !== null;
    if (!hasMin && !hasMax) return undefined;
    if (hasMin && hasMax) return `${min}~${max}`;
    return `${hasMin ? min : max}`;
  }

  private toDto(row: Unit) {
    const u = row as any;

    const salePrice = u.salePrice != null ? Number(u.salePrice) : undefined;

    const maintenanceFee =
      u.maintenanceFee != null ? Number(u.maintenanceFee) : undefined;

    // 전용/실평: 이미 문자열이면 그대로, 아니면 min/max로 합성
    const exclusiveArea: string | undefined =
      typeof u.exclusiveArea === 'string'
        ? u.exclusiveArea
        : this.packRange(u.exclusiveMinM2, u.exclusiveMaxM2);

    const realArea: string | undefined =
      typeof u.realArea === 'string'
        ? u.realArea
        : this.packRange(
            u.realMinM2 ?? u.supplyMinM2,
            u.realMaxM2 ?? u.supplyMaxM2,
          );

    return {
      id: u.id,
      title: u.title ?? u.name ?? undefined,
      dealStatus: u.dealStatus ?? undefined,

      salePrice,
      maintenanceFee,

      exclusiveArea,
      realArea,

      // 구조/옵션/방향/이미지 (없으면 안전한 기본값)
      unitLines: Array.isArray(u.unitLines) ? u.unitLines : [],
      options: Array.isArray(u.options) ? u.options : [],
      orientations: Array.isArray(u.orientations) ? u.orientations : undefined,
      images: Array.isArray(u.images) ? u.images : [],

      // 메모/메타 (없으면 undefined)
      publicMemo: u.publicMemo ?? undefined,
      secretMemo: u.secretMemo ?? undefined,

      createdByName: u.createdByName ?? undefined,
      createdAt: u.createdAt ?? undefined,
      inspectedByName: u.inspectedByName ?? undefined,
      inspectedAt: u.inspectedAt ?? undefined,
      updatedByName: u.updatedByName ?? undefined,
      updatedAt: u.updatedAt ?? undefined,
    };
  }
}
