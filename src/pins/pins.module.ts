import { Module } from '@nestjs/common';
import { PinsService } from './pins.service';
import { PinsController } from './pins.controller';
import { Pin } from './entities/pin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from '../units/entities/unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pin, Unit])],
  controllers: [PinsController],
  providers: [PinsService],
})
export class PinsModule {}
