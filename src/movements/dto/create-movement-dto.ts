import {
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  MovementCategory,
  MovementType,
} from '../../common/interfaces/Movement';
import { Type } from 'class-transformer';
import { OmitType, PartialType } from '@nestjs/swagger';
import { IsCategoryCompatibleWithType } from './validate-movement-category.decorator';

export class CreateMovementDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(MovementType)
  @IsNotEmpty()
  type: MovementType;

  @IsEnum(MovementCategory)
  @IsNotEmpty()
  @IsCategoryCompatibleWithType()
  category: MovementCategory;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  walletId: number;
}

export class UpdateMovementDto extends PartialType(
  OmitType(CreateMovementDto, ['walletId']),
) {}
