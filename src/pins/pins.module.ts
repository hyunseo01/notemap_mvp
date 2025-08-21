import { Module } from '@nestjs/common';
import { PinsService } from './pins.service';
import { PinsController } from './pins.controller';
import { Pin } from './entities/pin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Pin])],
  controllers: [PinsController],
  providers: [PinsService],
})
export class PinsModule {}
