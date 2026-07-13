import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

function toBool(value: unknown): boolean {
  if (value === true || value === 'true' || value === '1') return true;
  if (value === false || value === 'false' || value === '0') return false;
  return false;
}

export class GetTodosQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 5;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  /**
   * Read raw query value from `obj` — avoid implicit Boolean("false") === true.
   */
  @IsOptional()
  @Transform(({ obj }) => toBool(obj.isArchived))
  @IsBoolean()
  isArchived: boolean = false;
}
