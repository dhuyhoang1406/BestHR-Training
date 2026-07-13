import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class BulkIdsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  ids: string[];
}
