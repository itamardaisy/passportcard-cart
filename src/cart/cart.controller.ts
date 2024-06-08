import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { AddProductToCartDto } from './dto/add-product-to-cart.dto';
import { RemoveProductFromCartDto } from './dto/remove-product-from-cart.dto';
import { UpdateProductQuantityDto } from './dto/update-product-quantity.dto';
import { ViewProductObjectDto } from './dto/view-product-object.dto';

@Controller('cart')
export class CartController {
	constructor(private readonly cartService: CartService) { }


	@Put('add-product')
	@HttpCode(HttpStatus.OK)
	async addProduct(@Body() addProductToCartDto: AddProductToCartDto): Promise<Cart> {
		const { userId, productId, quantity } = addProductToCartDto;
		return this.cartService.addProductToCart(userId, productId, quantity);
	}

	@Delete('remove-product')
	@HttpCode(HttpStatus.OK)
	async removeProduct(@Body() removeProductFromCartDto: RemoveProductFromCartDto): Promise<Cart> {
		const { userId, productId, quantity } = removeProductFromCartDto;
		return this.cartService.removeProductFromCart(userId, productId, quantity);
	}

	@Put('update-product-quantity')
	@HttpCode(HttpStatus.OK)
	async updateProductQuantity(@Body() updateProductQuantityDto: UpdateProductQuantityDto): Promise<Cart> {
		const { userId, productId, quantity } = updateProductQuantityDto;
		return this.cartService.updateProductQuantity(userId, productId, quantity);
	}

	@Get('view')
	@HttpCode(HttpStatus.OK)
	async getCartView(@Query('userId') userId: number): Promise<ViewProductObjectDto[]> {
		return this.cartService.getCartView(userId);
	}
}
