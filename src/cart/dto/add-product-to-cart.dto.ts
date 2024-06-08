// src/cart/dto/add-product-to-cart.dto.ts
import { IsInt, IsUUID, Min } from 'class-validator';

export class AddProductToCartDto {
	@IsInt()
	userId: number;

	@IsUUID()
	productId: string;

	@IsInt()
	@Min(1)
	quantity: number;
}
