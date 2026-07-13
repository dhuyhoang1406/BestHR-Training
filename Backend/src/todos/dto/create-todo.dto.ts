import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID('4')
  userId: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsUUID('4', { each: true })
  categoryIds?: string[];
}
