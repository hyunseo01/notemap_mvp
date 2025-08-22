import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

class UnitLineDto {
  @IsInt() rooms: number;
  @IsInt() baths: number;
  @IsOptional() duplex?: boolean;
  @IsOptional() terrace?: boolean;
  @IsOptional() @IsString() primary?: string;
  @IsOptional() @IsString() secondary?: string;
}
class OrientationDto {
  @IsInt() ho: number;
  @IsString() value: string;
}

export class CreateUnitDto {
  @IsString() pinId: string;

  @IsString() title: string;
  @IsOptional() @IsString() address?: string;

  @Type(() => Number) @IsNumber() lat: number;
  @Type(() => Number) @IsNumber() lng: number;

  @IsIn(['공개', '보류', '비공개']) status: '공개' | '보류' | '비공개';
  @IsOptional() @IsString() dealStatus?: string;

  @IsOptional() @Type(() => Number) @IsInt() salePrice?: number; // 원
  @IsOptional() @Type(() => Number) @IsInt() maintenanceFee?: number; // 원
  @IsOptional() @IsString() priceText?: string;

  @IsOptional() @IsArray() options?: string[];
  @IsOptional() @IsString() optionEtc?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UnitLineDto)
  @IsArray()
  unitLines?: UnitLineDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrientationDto)
  @IsArray()
  orientations?: OrientationDto[];

  @IsOptional() images?: string[];
}
export class UpdateUnitDto extends PartialType(CreateUnitDto) {}
