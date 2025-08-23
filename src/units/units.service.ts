import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit) private readonly repo: Repository<Unit>,
  ) {}

  /* --------------------------- CRUD --------------------------- */

  /** 목록 */
  async findAll() {
    const list = await this.repo.find({
      order: { createdAt: 'DESC' as any },
    });
    return list.map((u) => this.toDto(u));
  }

  /** 생성 */
  async create(dto: CreateUnitDto) {
    const e = this.repo.create({
      ...(dto as any),
      // 숫자형 정규화
      salePrice: this.n((dto as any).salePrice),
      maintenanceFee: this.n((dto as any).maintenanceFee),
      exclusiveMinM2: this.n((dto as any).exclusiveMinM2),
      exclusiveMaxM2: this.n((dto as any).exclusiveMaxM2),
      supplyMinM2: this.n((dto as any).supplyMinM2),
      supplyMaxM2: this.n((dto as any).supplyMaxM2),
      realMinM2: this.n((dto as any).realMinM2),
      realMaxM2: this.n((dto as any).realMaxM2),
      lat: this.n((dto as any).lat),
      lng: this.n((dto as any).lng),
    } as Partial<Unit>) as Unit;

    const saved = await this.repo.save(e);
    return this.toDto(saved);
  }

  /** 단건 상세 */
  async findOne(id: string) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('unit not found');
    return this.toDto(u);
  }

  /** 수정 */
  async update(id: string, dto: UpdateUnitDto) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('unit not found');

    const patch: any = { ...(dto as any) };

    // 숫자 필드만 안전하게 덮어씀
    if ((dto as any).salePrice !== undefined)
      patch.salePrice = this.n((dto as any).salePrice);
    if ((dto as any).maintenanceFee !== undefined)
      patch.maintenanceFee = this.n((dto as any).maintenanceFee);
    if ((dto as any).exclusiveMinM2 !== undefined)
      patch.exclusiveMinM2 = this.n((dto as any).exclusiveMinM2);
    if ((dto as any).exclusiveMaxM2 !== undefined)
      patch.exclusiveMaxM2 = this.n((dto as any).exclusiveMaxM2);
    if ((dto as any).supplyMinM2 !== undefined)
      patch.supplyMinM2 = this.n((dto as any).supplyMinM2);
    if ((dto as any).supplyMaxM2 !== undefined)
      patch.supplyMaxM2 = this.n((dto as any).supplyMaxM2);
    if ((dto as any).realMinM2 !== undefined)
      patch.realMinM2 = this.n((dto as any).realMinM2);
    if ((dto as any).realMaxM2 !== undefined)
      patch.realMaxM2 = this.n((dto as any).realMaxM2);
    if ((dto as any).lat !== undefined) patch.lat = this.n((dto as any).lat);
    if ((dto as any).lng !== undefined) patch.lng = this.n((dto as any).lng);

    Object.assign(u, patch);
    const saved = await this.repo.save(u);
    return this.toDto(saved);
  }

  /** 삭제 */
  async remove(id: string): Promise<void> {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('unit not found');
    await this.repo.remove(u);
  }

  /* ------------------------- Helpers -------------------------- */

  /** 문자열/숫자 → number | null */
  private n(v: unknown): number | null {
    const x = typeof v === 'string' ? Number(v) : (v as number);
    return Number.isFinite(x) ? (x as number) : null;
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

  /** 서버 → 프론트 DTO (단일 정의) */
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

      // 구조/옵션/방향/이미지
      unitLines: Array.isArray(u.unitLines) ? u.unitLines : [],
      options: Array.isArray(u.options) ? u.options : [],
      orientations: Array.isArray(u.orientations) ? u.orientations : undefined,
      images: Array.isArray(u.images) ? u.images : [],

      // 메모/메타
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
