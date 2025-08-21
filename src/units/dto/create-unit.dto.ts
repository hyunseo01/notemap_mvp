import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUnitDto {
  @IsOptional() @IsString() @MaxLength(30) floorLabel?: string;
  @IsOptional() @IsInt() rooms?: number;
  @IsOptional() @IsInt() baths?: number;
  @IsOptional() @IsBoolean() isDuplex?: boolean;
  @IsOptional() @IsBoolean() hasTerrace?: boolean;
  @IsOptional() @IsNumber() areaM2Net?: number;
  @IsOptional() @IsNumber() areaM2Usable?: number;
  @IsOptional() @IsString() @MaxLength(10) orientation1?: string;
  @IsOptional() @IsString() @MaxLength(10) orientation2?: string;
  @IsOptional() @IsString() @MaxLength(10) orientation3?: string;
  @IsOptional() @IsString() memo?: string;
}
