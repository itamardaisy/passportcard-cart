import { ProductDto } from "src/product/dto/product.dto";

export class CartItemDto {
	product: ProductDto;
	quantity: number;
}