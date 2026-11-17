import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateClassDto {
  @Transform(trim)
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  activity: string;

  @Transform(trim)
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  room: string;

  @IsDateString()
  startsAt: string;

  @IsInt()
  @Min(1)
  spots: number;

  @IsInt()
  @Min(1)
  trainerId: number;
}
