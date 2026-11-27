import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

const trimString = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateEnquiryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  productId!: number;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @Transform(trimString)
  @IsEmail()
  @MaxLength(320)
  email!: string;

  @Transform(trimString)
  @IsString()
  @Matches(/^\+?[\d\s().-]{7,24}$/, {
    message: 'phone must be a valid phone number',
  })
  phone!: string;

  @Transform(trimString)
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message!: string;
}
