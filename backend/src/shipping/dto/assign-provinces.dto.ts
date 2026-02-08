import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class AssignProvincesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  provinces: string[];
}
