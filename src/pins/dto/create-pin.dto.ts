import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreatePinDto {
  @IsString() title: string;
  @IsOptional() @IsString() address?: string;

  @Type(() => Number) @IsNumber() lat: number;
  @Type(() => Number) @IsNumber() lng: number;

  @IsIn(['공개', '보류', '비공개']) status: '공개' | '보류' | '비공개';

  @IsOptional() @IsString() officePhone?: string;
  @IsOptional() @IsString() officePhone2?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'O') return true;
    if (value === 'X') return false;
    if (value === '1' || value === 1) return true;
    if (value === '0' || value === 0) return false;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return Boolean(value);
  })
  elevator?: boolean;

  @IsOptional() @IsString() parkingType?: string;
  @IsOptional() @IsString() parkingGrade?: string;
  @IsOptional() @IsInt() @Min(0) @Max(5) parkingStars?: number;

  @IsOptional() @IsInt() totalBuildings?: number;
  @IsOptional() @IsInt() totalFloors?: number;
  @IsOptional() @IsInt() totalHouseholds?: number;

  @IsOptional() @IsString() completionDate?: string;
  @IsOptional()
  @IsIn(['주택', 'APT', 'OP', '도/생', '근/생'])
  buildingType?: any;
  @IsOptional() @IsString() deed?: string;
  @IsOptional() @IsIn(['상', '중', '하']) slopeGrade?: any;
  @IsOptional() @IsIn(['상', '중', '하']) structureGrade?: any;

  @IsOptional() @IsString() publicMemo?: string;
  @IsOptional() @IsString() secretMemo?: string;

  @IsOptional() images?: string[];
}
