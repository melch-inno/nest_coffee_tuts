import { IsString, IsNumber } from 'class-validator';
export class CreateCoffeeDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  readonly price: number;

  @IsString()
  readonly brand: string;

  @IsString({ each: true })
  readonly flavours: string[];

  @IsNumber()
  readonly rating: number;
}
