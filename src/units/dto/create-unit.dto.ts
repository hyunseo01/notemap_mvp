import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUnitDto {
  @IsOptional() @IsString() @MaxLength(30) floorLabel?: string;
  @IsOptional() @Type(() => Number) @IsInt() rooms?: number;
  @IsOptional() @Type(() => Number) @IsInt() baths?: number;
  @IsOptional() @IsBoolean() isDuplex?: boolean;
  @IsOptional() @IsBoolean() hasTerrace?: boolean;
  @IsOptional() @Type(() => Number) @IsNumber() areaM2Net?: number;
  @IsOptional() @Type(() => Number) @IsNumber() areaM2Usable?: number;
  @IsOptional() @IsString() @MaxLength(10) orientation1?: string;
  @IsOptional() @IsString() @MaxLength(10) orientation2?: string;
  @IsOptional() @IsString() @MaxLength(10) orientation3?: string;
  @IsOptional() @IsString() memo?: string;
}
