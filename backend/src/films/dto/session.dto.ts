import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsISO8601,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';

export class SessionDto {
  @IsUUID()
  id: string;

  @IsISO8601({ strict: true })
  daytime: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  hall: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  rows: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  seats: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  price: number;

  @IsArray()
  @IsString({ each: true })
  @Matches(/^\d+:\d+$/, {
    each: true,
  })
  taken: string[];
}
