import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pin } from '../../pins/entities/pin.entity';

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ name: 'pin_id', type: 'bigint', unsigned: true })
  pinId!: string;

  @ManyToOne(() => Pin, (p) => p.units, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pin_id' })
  pin!: Pin;

  @Column({ name: 'floor_label', type: 'varchar', length: 30, nullable: true })
  floorLabel!: string | null;

  @Column({ type: 'tinyint', nullable: true })
  rooms!: number | null;

  @Column({ type: 'tinyint', nullable: true })
  baths!: number | null;

  @Column({ name: 'is_duplex', type: 'boolean', default: false })
  isDuplex!: boolean;

  @Column({ name: 'has_terrace', type: 'boolean', default: false })
  hasTerrace!: boolean;

  @Column('double', { name: 'area_m2_net', nullable: true })
  areaM2Net!: number | null;

  @Column('double', { name: 'area_m2_usable', nullable: true })
  areaM2Usable!: number | null;

  @Column({
    name: 'orientation_1',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  orientation1!: string | null;

  @Column({
    name: 'orientation_2',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  orientation2!: string | null;

  @Column({
    name: 'orientation_3',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  orientation3!: string | null;

  @Column({ type: 'text', nullable: true })
  memo!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
