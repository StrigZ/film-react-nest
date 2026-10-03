import { IsArray, IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';

export class FilmDto {
  @IsUUID()
  id: string;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(10)
  rating: number;

  @IsString()
  director: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  image: string;

  @IsString()
  cover: string;

  @IsString()
  title: string;

  @IsString()
  about: string;

  @IsString()
  description: string;
}
