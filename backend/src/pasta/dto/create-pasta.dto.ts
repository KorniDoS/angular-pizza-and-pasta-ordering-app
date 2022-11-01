import {TrueOrFalse } from '../true-false.enum';
import {IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePastaDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  toppings: string[]

  @IsNotEmpty()
  price: string;

  @IsOptional()
  global: TrueOrFalse;

}
