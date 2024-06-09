import { IsUUID, IsInt, IsPositive } from 'class-validator';

export class RemoveProductFromCartDto {
	@IsInt()
	userId: number;

	@IsUUID()
	productId: string;
}
