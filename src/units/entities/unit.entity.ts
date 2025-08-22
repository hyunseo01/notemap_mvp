import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('units')
@Index('idx_units_pin', ['pinId'])
@Index('idx_units_lat_lng', ['lat', 'lng'])
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() pinId: string;

  @Column() title: string;
  @Column({ nullable: true }) address?: string;

  @Column('decimal', { precision: 10, scale: 6 }) lat: number;
  @Column('decimal', { precision: 10, scale: 6 }) lng: number;

  @Column({ default: '공개' }) status: '공개' | '보류' | '비공개';
  @Column({ nullable: true }) dealStatus?: string;

  @Column({ type: 'bigint', nullable: true }) salePrice?: number; // 예: 500000000
  @Column({ type: 'int', nullable: true }) maintenanceFee?: number; // 예: 50000

  @Column({ nullable: true }) priceText?: string; // 있으면 그대로 보관만
  @Column('json', { nullable: true }) options?: string[];
  @Column({ nullable: true }) optionEtc?: string;
  @Column('json', { nullable: true })
  unitLines?: {
    rooms: number;
    baths: number;
    duplex?: boolean;
    terrace?: boolean;
    primary?: string;
    secondary?: string;
  }[];
  @Column('json', { nullable: true })
  orientations?: { ho: number; value: string }[];
  @Column('json', { nullable: true }) images?: string[];

  @CreateDateColumn({ type: 'datetime' }) createdAt: Date;
  @UpdateDateColumn({ type: 'datetime' }) updatedAt: Date;
}
