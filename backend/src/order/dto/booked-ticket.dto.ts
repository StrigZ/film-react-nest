import { Type } from 'class-transformer';
import { IsInt, IsISO8601, IsUUID, Min } from 'class-validator';

export class BookedTicketDto {
  @IsUUID()
  id: string;

  @IsUUID()
  film: string;

  @IsUUID()
  session: string;

  @IsISO8601({ strict: true })
  daytime: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  row: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  seat: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  price: number;
}
