import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { Connection, EntityManager } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockCartRepository = () => ({
	findOne: jest.fn(),
	save: jest.fn(),
});

const mockProductService = () => ({
	getProductById: jest.fn(),
});

const mockUserService = () => ({
	findOne: jest.fn(),
});

const mockConnection = () => ({
	transaction: jest.fn(),
});

describe('CartService', () => {
	let cartService: CartService;
	let cartRepository;
	let productService;
	let userService;
	let connection;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CartService,
				{ provide: 'CartRepository', useFactory: mockCartRepository },
				{ provide: ProductService, useFactory: mockProductService },
				{ provide: UserService, useFactory: mockUserService },
				{ provide: Connection, useFactory: mockConnection },
			],
		}).compile();

		cartService = module.get<CartService>(CartService);
		cartRepository = module.get('CartRepository');
		productService = module.get<ProductService>(ProductService);
		userService = module.get<UserService>(UserService);
		connection = module.get<Connection>(Connection);
	});

	describe('createCart', () => {
		it('should create a new cart for the user', async () => {
			const userId = 1;
			const user = new User();
			user.id = userId;
			userService.findOne.mockResolvedValue(user);

			const manager = {
				save: jest.fn(),
			};

			const result = await cartService.createCart(userId, manager as unknown as EntityManager);
			expect(manager.save).toHaveBeenCalled();
			expect(result).toHaveProperty('userId', userId);
		});

		it('should throw an error if user already has a cart', async () => {
			const userId = 1;
			const user = new User();
			user.id = userId;
			user.cart = new Cart();
			userService.findOne.mockResolvedValue(user);

			const manager = {
				save: jest.fn(),
			};

			await expect(cartService.createCart(userId, manager as unknown as EntityManager)).rejects.toThrow(
				'User already have a cart',
			);
		});
	});

	describe('addProductToCart', () => {
		it('should add a product to the cart', async () => {
			const userId = 1;
			const productId = '1';
			const quantity = 2;

			const cart = new Cart();
			cart.products = [];

			const product = new Product();
			product.id = productId;
			product.stockQuantity = 10;

			const manager = {
				findOne: jest.fn(),
				save: jest.fn(),
			};

			manager.findOne.mockResolvedValueOnce(cart);
			manager.findOne.mockResolvedValueOnce(product);

			connection.transaction.mockImplementation((cb) => cb(manager));

			const result = await cartService.addProductToCart(userId, productId, quantity);
			expect(manager.save).toHaveBeenCalled();
			expect(result.products).toHaveLength(quantity);
		});

		it('should throw an error if product is not found', async () => {
			const userId = 1;
			const productId = '1';
			const quantity = 2;

			const cart = new Cart();
			cart.products = [];

			const manager = {
				findOne: jest.fn(),
				save: jest.fn(),
			};

			manager.findOne.mockResolvedValueOnce(cart);
			manager.findOne.mockResolvedValueOnce(null);

			connection.transaction.mockImplementation((cb) => cb(manager));

			await expect(cartService.addProductToCart(userId, productId, quantity)).rejects.toThrow(NotFoundException);
		});

		it('should throw an error if not enough stock', async () => {
			const userId = 1;
			const productId = '1';
			const quantity = 2;

			const cart = new Cart();
			cart.products = [];

			const product = new Product();
			product.id = productId;
			product.stockQuantity = 1;

			const manager = {
				findOne: jest.fn(),
				save: jest.fn(),
			};

			manager.findOne.mockResolvedValueOnce(cart);
			manager.findOne.mockResolvedValueOnce(product);

			connection.transaction.mockImplementation((cb) => cb(manager));

			await expect(cartService.addProductToCart(userId, productId, quantity)).rejects.toThrow(BadRequestException);
		});
	});

	describe('getCartView', () => {
		it('should return a view of the cart', async () => {
			const userId = 1;

			const cart = new Cart();
			cart.products = [
				{ id: '1', name: 'Product 1' } as Product,
				{ id: '1', name: 'Product 1' } as Product,
				{ id: '2', name: 'Product 2' } as Product,
			];

			cartRepository.findOne.mockResolvedValue(cart);

			const result = await cartService.getCartView(userId);
			expect(result).toEqual([
				{ productName: 'Product 1', quantity: 2 },
				{ productName: 'Product 2', quantity: 1 },
			]);
		});

		it('should throw an error if cart is not found', async () => {
			const userId = 1;
			cartRepository.findOne.mockResolvedValue(null);

			await expect(cartService.getCartView(userId)).rejects.toThrow(NotFoundException);
		});
	});
});
