import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { PinsModule } from './pins/pins.module';
import { UnitsModule } from './units/units.module';
import { ConfigModule } from '@nestjs/config';
import { Pin } from './pins/pin.entity';
import { Unit } from './units/unit.entity';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Pin, Unit],
      synchronize: true,
      logging: false,
    }),
    PinsModule,
    UnitsModule,
  ],
})
export class AppModule {}
