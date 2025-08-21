import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePinDto {
  @IsNumber() lat!: number;
  @IsNumber() lng!: number;

  @IsString() addressLine!: string;

  @IsString() @MaxLength(50) province!: string;
  @IsString() @MaxLength(50) city!: string;
  @IsString() @MaxLength(50) district!: string;

  @IsOptional() completionDate?: string; // 'YYYY-MM-DD'
  @IsOptional() buildingCount?: number;
  @IsOptional() floorCount?: number;
  @IsOptional() householdCount?: number;
  @IsOptional() householdRemaining?: number;
  @IsOptional() parkingTypeId?: number;
  @IsOptional() registrationTypeId?: number;
}
