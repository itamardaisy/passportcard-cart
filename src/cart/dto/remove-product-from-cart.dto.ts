import { IsUUID, IsInt, Min } from 'class-validator';

export class RemoveProductFromCartDto {
	@IsInt()
	userId: number;

	@IsUUID()
	productId: string;

	@IsInt()
	@Min(1)
	quantity: number;
}
