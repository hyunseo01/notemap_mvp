import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit) private readonly repo: Repository<Unit>,
  ) {}

  async findOne(id: string) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('unit not found');

    return {
      success: true,
      message: 'ok',
      data: this.toDto(u),
    };
  }

  /** "50~60" 같은 범위 문자열 생성 (둘 중 하나만 있으면 단일값) */
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

  /** 서버 → 프론트 DTO (단일 정의! 중복 금지) */
  private toDto(row: Unit) {
    const u = row as any;

    const salePrice = u.salePrice != null ? Number(u.salePrice) : undefined;
    const maintenanceFee =
      u.maintenanceFee != null ? Number(u.maintenanceFee) : undefined;

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

      unitLines: Array.isArray(u.unitLines) ? u.unitLines : [],
      options: Array.isArray(u.options) ? u.options : [],
      orientations: Array.isArray(u.orientations) ? u.orientations : undefined,
      images: Array.isArray(u.images) ? u.images : [],

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
