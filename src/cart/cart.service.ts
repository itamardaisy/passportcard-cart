import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../product/product.entity';
import { CartRepository } from './cart.repository';
import { User } from '../user/user.entity';
import { ViewProductObjectDto } from './dto/view-product-object.dto';
import { CartToProduct } from './cart-product.entity';
import { CartDto } from './dto/cart.dto';
import { CartItemDto } from './dto/cart-item.dto';
import { ProductDto } from '../product/dto/product.dto';

@Injectable()
export class CartService {
	constructor(
		@Inject('CartRepository')
		private _cartRepository: CartRepository,
		private readonly _connection: Connection,
	) { }

	public async createCart(userId: number, manager: EntityManager): Promise<Cart> {
		const user = await manager.findOne(User, { where: { id: userId } });

		this.validateCartCreationForUser(user);

		const cart = new Cart();
		cart.user = user;
		cart.userId = userId;
		cart.cartToProducts = [];
		manager.save(cart);

		return cart;
	}

	public async addProductToCart(userId: number, productId: string, quantity: number): Promise<CartDto> {
		return this._connection.transaction(async (manager: EntityManager) => {
			const cart = await this.findOrCreateCart(userId, manager);
			const product = await manager.findOne(Product, { where: { id: productId } });

			if (!product) {
				throw new NotFoundException('Product not found');
			}

			if (product.stockQuantity < quantity) {
				throw new BadRequestException('Not enough stock for the product');
			}

			let cartToProduct = await manager.findOne(CartToProduct, { where: { cart, product } });
			if (cartToProduct) {
				cartToProduct.quantity += quantity;
			} else {
				cartToProduct = new CartToProduct();
				cartToProduct.cart = cart;
				cartToProduct.product = product;
				cartToProduct.quantity = quantity;
				cart.cartToProducts.push(cartToProduct);
			}

			product.stockQuantity -= quantity;
			await manager.save(product);
			await manager.save(cartToProduct);
			await manager.save(cart);

			return this.toCartDto(cart);
		});
	}

	public async updateProductQuantity(userId: number, productId: string, newQuantity: number): Promise<CartDto> {
		return this._connection.transaction(async (manager: EntityManager) => {
			const cart = await this.getUserCart(userId, manager);
			const product = await manager.findOne(Product, { where: { id: productId } });

			if (!cart) {
				throw new NotFoundException('Cart not found');
			}

			if (!product) {
				throw new NotFoundException('Product not found');
			}

			const cartToProduct = await this.findCartToProduct(cart.id, product.id, manager);

			if (!cartToProduct) {
				throw new BadRequestException('Product not found in the cart');
			}

			const currentQuantity = cartToProduct.quantity;

			if (newQuantity > currentQuantity) {
				const additionalQuantity = newQuantity - currentQuantity;
				if (product.stockQuantity < additionalQuantity) {
					throw new BadRequestException('Not enough stock for the product');
				}

				product.stockQuantity -= additionalQuantity;
				cartToProduct.quantity = newQuantity;
			} else if (newQuantity < currentQuantity) {
				const reduceQuantity = currentQuantity - newQuantity;
				product.stockQuantity += reduceQuantity;
				cartToProduct.quantity = newQuantity;
			}

			await manager.save(product);
			if (cartToProduct.quantity === 0) {
				cart.cartToProducts = cart.cartToProducts.filter(x => x.product.id !== productId); // Remove the product from the cart.
				await manager.remove(cartToProduct);
			} else {
				cart.cartToProducts.find(x => x.product.id === productId).quantity = newQuantity;  // Update the cart product quantity.
				await manager.save(cartToProduct);
			}

			await manager.save(cart);


			return this.toCartDto(cart);
		});
	}

	public async getCartView(userId: number): Promise<ViewProductObjectDto[]> {
		const cart = await this._cartRepository
			.createQueryBuilder('cart')
			.leftJoinAndSelect('cart.cartToProducts', 'cartToProduct')
			.leftJoinAndSelect('cartToProduct.product', 'product')
			.where('cart.userId = :userId', { userId })
			.getOne();

		if (!cart) {
			throw new NotFoundException('Cart not found');
		}

		return cart.cartToProducts.map(cartToProduct => {
			return {
				productName: cartToProduct.product.name,
				quantity: cartToProduct.quantity
			};
		});
	}

	public async removeProductFromCart(userId: number, productId: string): Promise<CartDto> {
		return this._connection.transaction(async (manager: EntityManager) => {
			const cart = await this.getUserCart(userId, manager);
			const product = await manager.findOne(Product, { where: { id: productId } });

			if (!cart) {
				throw new NotFoundException('User has no cart');
			}

			if (!product) {
				throw new NotFoundException('Product not found');
			}

			const cartToProduct = await manager.findOne(CartToProduct, { where: { cart, product } });
			if (!cartToProduct) {
				throw new BadRequestException('Product not found in the cart');
			}

			product.stockQuantity += cartToProduct.quantity;

			await manager.remove(cartToProduct);
			await manager.save(product);
			await manager.save(cart);

			return this.toCartDto(cart);
		});
	}

	private toCartDto(cart: Cart): CartDto {
		const cartDto = new CartDto();
		cartDto.id = cart.id;
		cartDto.content = [];

		if (cart.cartToProducts.length > 0) {
			for (const cartToProduct of cart.cartToProducts) {
				const cartItemDto = new CartItemDto();
				cartItemDto.product = new ProductDto();
				cartItemDto.product.productId = cartToProduct.product.id;
				cartItemDto.product.price = cartToProduct.product.price;
				cartItemDto.product.productName = cartToProduct.product.name;
				cartItemDto.quantity = cartToProduct.quantity;
				cartDto.content.push(cartItemDto);
			}
		}

		return cartDto;
	}

	private async getUserCart(userId: number, manager: EntityManager): Promise<Cart> {
		const cart = await manager
			.getRepository(Cart)
			.createQueryBuilder('cart')
			.leftJoinAndSelect('cart.cartToProducts', 'cartToProduct')
			.leftJoinAndSelect('cartToProduct.product', 'product')
			.where('cart.userId = :userId', { userId })
			.getOne();
		if (!cart) {
			throw new Error('User have no cart');
		}
		return cart;
	}

	private async findCartToProduct(cartId: number, productId: string, manager: EntityManager): Promise<CartToProduct> {
		const cartToProduct = await manager
			.getRepository(CartToProduct)
			.createQueryBuilder('cart_to_product')
			.leftJoinAndSelect('cart_to_product.product', 'product')
			.leftJoinAndSelect('cart_to_product.cart', 'cart')
			.where('cart_to_product.cartId = :cartId AND cart_to_product.productId = :productId', { cartId, productId })
			.getOne();

		if (!cartToProduct) {
			throw new Error('CartToProduct element not found');
		}

		return cartToProduct;
	}

	private async findOrCreateCart(userId: number, manager: EntityManager): Promise<Cart> {
		const cart = await manager
			.getRepository(Cart)
			.createQueryBuilder('cart')
			.leftJoinAndSelect('cart.cartToProducts', 'cartToProduct')
			.leftJoinAndSelect('cartToProduct.product', 'product')
			.where('cart.userId = :userId', { userId })
			.getOne();
		return !cart ? this.createCart(userId, manager) : cart;
	}

	private validateCartCreationForUser(user: User): void {
		if (!user) {
			throw new Error('User not found');
		}

		if (user.cart) {
			throw new Error(`User already have a cart: ${user.cart.id}`);
		}
	}
}
