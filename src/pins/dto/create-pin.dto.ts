import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePinDto {
  @IsString() title: string;
  @IsOptional() @IsString() address?: string;

  @Type(() => Number) @IsNumber() lat: number;
  @Type(() => Number) @IsNumber() lng: number;

  @IsIn(['공개', '보류', '비공개']) status: '공개' | '보류' | '비공개';

  @IsOptional() @IsString() officePhone?: string;
  @IsOptional() @IsString() officePhone2?: string;

  @IsOptional() @IsIn(['O', 'X']) elevator?: 'O' | 'X';
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
