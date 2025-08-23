// src/pins/pins.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pin } from './entities/pin.entity';
import { Unit } from '../units/entities/unit.entity';
import { CreatePinDto } from './dto/create-pin.dto';
import { UpdatePinDto } from './dto/update-pin.dto';

@Injectable()
export class PinsService {
  constructor(
    @InjectRepository(Pin) private readonly pinRepo: Repository<Pin>,
    @InjectRepository(Unit) private readonly unitRepo: Repository<Unit>,
  ) {}

  /* --------------------------- CRUD --------------------------- */

  async create(dto: CreatePinDto) {
    // lat/lng 등 숫자형 정규화
    const entity = this.pinRepo.create({
      ...(dto as any),
      lat: this.n((dto as any).lat),
      lng: this.n((dto as any).lng),
    });
    const saved = await this.pinRepo.save(entity);
    return this.toDto(saved);
  }

  async findAll() {
    const list = await this.pinRepo.find({
      order: { createdAt: 'DESC' as any },
    });
    return list.map((p) => this.toDto(p));
  }

  /** 핀 상세 + 매물 요약 포함 */
  async findOne(id: string) {
    const p = await this.pinRepo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('pin not found');

    // 핀에 속한 유닛 로드 (pinId 컬럼/관계 모두 대응)
    let units: Unit[] = await this.unitRepo.find({
      where: { pinId: id } as any,
      order: { createdAt: 'ASC' as any },
    });

    // 만약 pinId 컬럼이 없고 관계필드가 있을 때 보강
    if (!units.length) {
      units = await this.unitRepo.find({
        where: { pin: { id } } as any,
        order: { createdAt: 'ASC' as any },
        relations: ['pin'],
      });
    }

    const dto: any = this.toDto(p);
    dto.unitsSummary = units.map((u) => this.toUnitSummary(u));
    return dto;
  }

  async update(id: string, dto: UpdatePinDto) {
    const p = await this.pinRepo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('pin not found');

    const patch = {
      ...(dto as any),
      lat: (dto as any).lat !== undefined ? this.n((dto as any).lat) : p.lat,
      lng: (dto as any).lng !== undefined ? this.n((dto as any).lng) : p.lng,
    };

    Object.assign(p, patch);
    const saved = await this.pinRepo.save(p);
    return this.toDto(saved);
  }

  async remove(id: string) {
    const p = await this.pinRepo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('pin not found');
    await this.pinRepo.remove(p);
    return { id };
  }

  /* ------------------------- Helpers -------------------------- */

  /** 공통 숫자 변환 */
  private n(v: unknown): number | null {
    const x = typeof v === 'string' ? Number(v) : (v as number);
    return Number.isFinite(x) ? (x as number) : null;
  }

  /** 'O'|'X' 또는 숫자/문자열을 boolean으로 */
  private toBoolElevator(v: unknown): boolean {
    if (typeof v === 'string') {
      const s = v.trim().toLowerCase();
      if (s === 'o') return true;
      if (s === 'x') return false;
      if (s === '1' || s === 'true') return true;
      if (s === '0' || s === 'false') return false;
    }
    return !!v;
  }

  /** 숫자 → "억/만" 라벨 */
  private toKoreanMoney(n?: number | null) {
    if (n == null || Number.isNaN(n)) return undefined;
    const eok = Math.floor(n / 100_000_000);
    const man = Math.floor((n % 100_000_000) / 10_000);
    const rest = n % 10_000;
    const parts: string[] = [];
    if (eok) parts.push(`${eok}억`);
    if (man) parts.push(`${man}만`);
    if (!eok && !man && rest) parts.push(`${rest}`);
    return parts.join(' ');
  }

  /** 핀 → 프론트용 DTO (목록/상세 공통) */
  private toDto(p: Pin) {
    const anyP = p as any;
    return {
      id: p.id,
      title: anyP.title ?? '',
      address: anyP.address ?? '',
      position: { lat: Number(anyP.lat), lng: Number(anyP.lng) },

      status: anyP.status,
      elevator: this.toBoolElevator(anyP.elevator),

      // 연락처는 view에도 동시 제공(프론트 기대 구조)
      officePhone: anyP.officePhone,
      officePhone2: anyP.officePhone2,
      view: {
        officePhone: anyP.officePhone,
        officePhone2: anyP.officePhone2,
      },

      parkingType: anyP.parkingType,
      parkingGrade: anyP.parkingGrade,
      parkingStars: this.n(anyP.parkingStars) ?? undefined,

      totalBuildings: this.n(anyP.totalBuildings) ?? undefined,
      totalFloors: this.n(anyP.totalFloors) ?? undefined,
      totalHouseholds: this.n(anyP.totalHouseholds) ?? undefined,

      completionDate: anyP.completionDate ?? undefined,
      buildingType: anyP.buildingType,
      deed: anyP.deed,
      slopeGrade: anyP.slopeGrade,
      structureGrade: anyP.structureGrade,

      publicMemo: anyP.publicMemo ?? undefined,
      secretMemo: anyP.secretMemo ?? undefined,

      images: Array.isArray(anyP.images) ? anyP.images : [],
    };
  }

  /** 유닛 → 핀 상세에 넣을 간단 요약 (칩/리스트용) */
  private toUnitSummary(u: Unit) {
    const x: any = u;
    const tags: string[] = [];

    // unitLines가 있으면 첫 줄만 요약 사용, 없으면 개별 필드 사용
    if (Array.isArray(x.unitLines) && x.unitLines.length > 0) {
      const l = x.unitLines[0];
      if (l?.rooms != null || l?.baths != null)
        tags.push(`${l?.rooms ?? '-'} / ${l?.baths ?? '-'}`);
      if (l?.duplex) tags.push('복층');
      if (l?.terrace) tags.push('테라스');
      if (l?.primary) tags.push(String(l.primary));
      if (l?.secondary) tags.push(String(l.secondary));
    } else {
      if (x.rooms != null || x.baths != null)
        tags.push(`${x.rooms ?? '-'} / ${x.baths ?? '-'}`);
      if (x.isDuplex) tags.push('복층');
      if (x.hasTerrace) tags.push('테라스');
    }

    const salePrice = x.salePrice != null ? Number(x.salePrice) : undefined;
    const maintenanceFee =
      x.maintenanceFee != null ? Number(x.maintenanceFee) : undefined;

    return {
      id: u.id,
      name: x.title ?? x.name ?? '',
      tags,
      priceLabel: this.toKoreanMoney(salePrice),
      maintenanceFee,
    };
  }
}
