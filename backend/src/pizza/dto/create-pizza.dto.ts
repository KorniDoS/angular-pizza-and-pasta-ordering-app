import { Size, CrustType, TrueOrFalse } from '../pizza-meta.enum';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePizzaDto {
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

  @IsNotEmpty()
  size: Size;

  @IsNotEmpty()
  crustType: CrustType;

  @IsOptional()
  global: TrueOrFalse;

}
