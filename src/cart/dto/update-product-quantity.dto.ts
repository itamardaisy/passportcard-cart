import { IsUUID, IsInt, IsPositive } from 'class-validator';

export class UpdateProductQuantityDto {
	@IsInt()
	userId: number;

	@IsUUID()
	productId: string;

	@IsInt()
	@IsPositive()
	quantity: number;
}
