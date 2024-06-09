import { CartItemDto } from "./cart-item.dto";

export class CartDto {
	id: number;
	content: CartItemDto[]
}