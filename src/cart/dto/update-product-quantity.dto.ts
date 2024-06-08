import { IsUUID, IsInt, IsPositive } from 'class-validator';

export class UpdateProductQuantityDto {
	@IsInt()
	userId: string;

	@IsUUID()
	productId: string;

	@IsInt()
	@IsPositive()
	quantity: number;
}
