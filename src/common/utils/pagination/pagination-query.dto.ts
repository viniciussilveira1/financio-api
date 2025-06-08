import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional } from 'class-validator';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from './pagination.util';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = DEFAULT_PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = DEFAULT_LIMIT;
}
