import { Module } from '@nestjs/common';
import { PinsService } from './pins.service';
import { PinsController } from './pins.controller';
import { Pin } from './entities/pin.entity';

@Module({
  imports: [Pin],
  controllers: [PinsController],
  providers: [PinsService],
})
export class PinsModule {}
