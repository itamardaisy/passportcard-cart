import { IsUUID, IsInt, Min, isInt } from 'class-validator';

export class UpdateProductQuantityDto {
	@IsInt()
	userId: string;

	@IsUUID()
	productId: string;

	@IsInt()
	@Min(1)
	quantity: number;
}
