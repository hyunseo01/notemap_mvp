import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pins')
@Index('idx_pins_lat_lng', ['lat', 'lng'])
export class Pin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() title: string;
  @Column({ nullable: true }) address?: string;

  // 좌표(필수)
  @Column('decimal', { precision: 10, scale: 6 }) lat: number;
  @Column('decimal', { precision: 10, scale: 6 }) lng: number;

  // 상태
  @Column({ default: '공개' })
  status: '공개' | '보류' | '비공개';

  // 연락처
  @Column({ nullable: true }) officePhone?: string;
  @Column({ nullable: true }) officePhone2?: string;

  // 설비/주차
  @Column({ type: 'boolean', default: false })
  elevator: boolean;

  @Column({ nullable: true }) parkingType?: string; // 자주식/기계식/혼합
  @Column({ nullable: true }) parkingGrade?: string;
  @Column({ type: 'tinyint', unsigned: true, nullable: true })
  parkingStars?: number; // 0~5

  // 단지 스펙
  @Column({ type: 'int', nullable: true }) totalBuildings?: number;
  @Column({ type: 'int', nullable: true }) totalFloors?: number;
  @Column({ type: 'int', nullable: true }) totalHouseholds?: number;

  // 날짜/분류/등급
  @Column({ type: 'date', nullable: true }) completionDate?: string; // YYYY-MM-DD
  @Column({ nullable: true })
  buildingType?: '주택' | 'APT' | 'OP' | '도/생' | '근/생';
  @Column({ nullable: true }) deed?: string; // 등기
  @Column({ nullable: true }) slopeGrade?: '상' | '중' | '하';
  @Column({ nullable: true }) structureGrade?: '상' | '중' | '하';

  // 메모/이미지
  @Column({ type: 'text', nullable: true }) publicMemo?: string;
  @Column({ type: 'text', nullable: true }) secretMemo?: string;
  @Column('json', { nullable: true }) images?: string[]; // URL 배열

  @CreateDateColumn({ type: 'datetime' }) createdAt: Date;
  @UpdateDateColumn({ type: 'datetime' }) updatedAt: Date;
}
