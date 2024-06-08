import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../product/product.entity';
import { CartRepository } from './cart.repository';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { ViewProductObjectDto } from './dto/view-product-object.dto';

@Injectable()
export class CartService {
	constructor(
		@Inject('CartRepository')
		private _cartRepository: CartRepository,
		private readonly _userService: UserService,
		private readonly _connection: Connection,
	) { }

	public async createCart(userId: number, manager: EntityManager): Promise<Cart> {
		const user = await this._userService.findOne(userId);

		this.validateCartCreationForUser(user);

		const cart = new Cart();
		cart.user = user;
		cart.userId = userId;
		manager.save(cart);

		return cart;
	}

	public async addProductToCart(userId: number, productId: string, quantity: number): Promise<Cart> {
		return this._connection.transaction(async (manager: EntityManager) => {
			const cart = await this.findOrCreateCart(userId, manager);
			const product = await manager.findOne(Product, { where: { id: productId } });

			if (!product) {
				throw new NotFoundException('Product not found');
			}

			this.validateAdditionToCart(cart, product, quantity);

			// Decrement the stock quantity
			product.stockQuantity -= quantity;
			await manager.save(product);

			// Add the product to the cart
			for (let i = 0; i < quantity; i++) {
				cart.products.push(product);
			}
			await manager.save(cart);

			return cart;
		});
	}

	public async updateProductQuantity(cartId: string, productId: string, newQuantity: number): Promise<Cart> {
		return this._connection.transaction(async (manager: EntityManager) => {
			const cart = await manager.findOne(Cart, { where: { id: cartId }, relations: ['products'] });
			const product = await manager.findOne(Product, { where: { id: productId } });

			if (!cart) {
				throw new NotFoundException('Cart not found');
			}

			if (!product) {
				throw new NotFoundException('Product not found');
			}

			const currentQuantity = cart.products.filter(p => p.id === productId).length;

			if (newQuantity > currentQuantity) {
				const additionalQuantity = newQuantity - currentQuantity;
				if (product.stockQuantity < additionalQuantity) {
					throw new BadRequestException('Not enough stock for the product');
				}

				product.stockQuantity -= additionalQuantity;
				for (let i = 0; i < additionalQuantity; i++) {
					cart.products.push(product);
				}
			} else if (newQuantity < currentQuantity) {
				const reduceQuantity = currentQuantity - newQuantity;
				product.stockQuantity += reduceQuantity;
				for (let i = 0; i < reduceQuantity; i++) {
					const index = cart.products.findIndex(p => p.id === productId);
					if (index !== -1) {
						cart.products.splice(index, 1);
					}
				}
			}

			await manager.save(product);
			await manager.save(cart);

			return cart;
		});
	}

	public async getCartView(userId: number): Promise<ViewProductObjectDto[]> {
		const cart = await this._cartRepository.findOne({ where: { userId }, relations: ['products'] });

		if (!cart) {
			throw new NotFoundException('Cart not found');
		}

		const productMap = new Map<string, ViewProductObjectDto>();

		for (const product of cart.products) {
			if (productMap.has(product.id)) {
				productMap.get(product.id)!.quantity += 1;
			} else {
				productMap.set(product.id, { productName: product.name, quantity: 1 });
			}
		}

		return Array.from(productMap.values());
	}

	public async removeProductFromCart(userId: number, productId: string, quantity: number): Promise<Cart> {
		return this._connection.transaction(async (manager: EntityManager) => {
			const cart = await manager.findOne(Cart, { where: { userId }, relations: ['products'] });
			const product = await manager.findOne(Product, { where: { id: productId } });
			if (!cart) {
				throw new NotFoundException('User Has no cart');
			}

			if (!product) {
				throw new NotFoundException('Product not found');
			}

			this.validateRemoveProductFromCart(cart, product, quantity);

			// Increment the stock quantity
			product.stockQuantity += quantity;
			await manager.save(product);

			// Remove the product from the cart
			for (let i = 0; i < quantity; i++) {
				const index = cart.products.findIndex(p => p.id === productId);
				if (index !== -1) {
					cart.products.splice(index, 1);
				}
			}
			await manager.save(cart);

			return cart;
		});
	}

	private async findOrCreateCart(userId: number, manager: EntityManager): Promise<Cart> {
		const cart = await manager.findOne(Cart, { where: { userId } });
		return !cart ? this.createCart(userId, manager) : cart;
	}

	private validateRemoveProductFromCart(cart: Cart, product: Product, quantity: number): void {
		const productIndex = cart.products.findIndex(p => p.id === product.id);
		if (productIndex === -1) {
			throw new BadRequestException('Product not found in the cart');
		}

		// Ensure there are enough products in the cart to remove
		const productCountInCart = cart.products.filter(p => p.id === product.id).length;
		if (productCountInCart < quantity) {
			throw new BadRequestException('Not enough products in the cart to remove');
		}
	}

	private validateAdditionToCart(cart: Cart, product: Product, quantity: number): void {
		if (product.stockQuantity < quantity) {
			throw new BadRequestException('Not enough stock for the product');
		}
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
