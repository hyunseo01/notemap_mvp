import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { Unit } from './entities/unit.entity';

@Module({
  imports: [Unit],
  controllers: [UnitsController],
  providers: [UnitsService],
})
export class UnitsModule {}
