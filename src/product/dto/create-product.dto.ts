import { IsString, IsNumber, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNumber()
	@IsNotEmpty()
	price: number;

	@IsNumber()
	@IsNotEmpty()
	stockQuantity: number;

	@IsDate()
	@IsNotEmpty()
	@Type(() => Date)
	expirationDate: Date;
}