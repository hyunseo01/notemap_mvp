import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Unit } from '../../units/entities/unit.entity';

@Entity('pins')
export class Pin {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string; // BIGINT

  @Column('double')
  lat!: number;

  @Column('double')
  lng!: number;

  @Column({ name: 'address_line', type: 'text' })
  addressLine!: string;

  @Column({ length: 50 })
  province!: string;

  @Column({ length: 50 })
  city!: string;

  @Column({ length: 50 })
  district!: string;

  @Column({ name: 'completion_date', type: 'date', nullable: true })
  completionDate!: string | null;

  @Column({ name: 'building_count', type: 'smallint', nullable: true })
  buildingCount!: number | null;

  @Column({ name: 'floor_count', type: 'smallint', nullable: true })
  floorCount!: number | null;

  @Column({ name: 'household_count', type: 'int', nullable: true })
  householdCount!: number | null;

  @Column({ name: 'household_remaining', type: 'int', nullable: true })
  householdRemaining!: number | null;

  @Column({
    name: 'parking_type_id',
    type: 'int',
    unsigned: true,
    nullable: true,
  })
  parkingTypeId!: number | null;

  @Column({
    name: 'parking_grade',
    type: 'enum',
    enum: ['상', '중', '하'],
    nullable: true,
  })
  parkingGrade!: '상' | '중' | '하' | null;

  @Column({
    name: 'slope_grade',
    type: 'enum',
    enum: ['상', '중', '하'],
    nullable: true,
  })
  slopeGrade!: '상' | '중' | '하' | null;

  @Column({
    name: 'structure_grade',
    type: 'enum',
    enum: ['상', '중', '하'],
    nullable: true,
  })
  structureGrade!: '상' | '중' | '하' | null;

  @Column({
    name: 'registration_type_id',
    type: 'int',
    unsigned: true,
    nullable: true,
  })
  registrationTypeId!: number | null;

  @Column({
    name: 'parking_verified_by',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  parkingVerifiedBy!: string | null;

  @Column({ name: 'parking_verified_at', type: 'datetime', nullable: true })
  parkingVerifiedAt!: Date | null;

  @Column({
    name: 'creator_id',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  creatorId!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted!: boolean;

  @Column({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt!: Date | null;

  @OneToMany(() => Unit, (u) => u.pin)
  units!: Unit[];
}
