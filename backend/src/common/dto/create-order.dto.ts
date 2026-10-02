import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class TicketDto {
  @IsString()
  film: string;
  @IsString()
  session: string;

  @IsInt()
  @Min(1)
  row: number;
  @IsInt()
  @Min(1)
  seat: number;

  @IsInt()
  @Min(1)
  price: number;

  @IsString()
  day: string;
  @IsString()
  daytime: string;
  @IsString()
  time: string;
}

export class CreateOrderDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}
