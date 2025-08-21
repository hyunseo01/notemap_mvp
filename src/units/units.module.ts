import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { Unit } from './entities/unit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pin } from '../pins/entities/pin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pin, Unit])],
  controllers: [UnitsController],
  providers: [UnitsService],
})
export class UnitsModule {}
