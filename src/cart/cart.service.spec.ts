import { NotFoundException } from "@nestjs/common";
import { User } from "../user/user.entity";
import { Cart } from "./cart.entity";
import { Product } from "../product/product.entity";
import { CartToProduct } from "./cart-product.entity";
import { CartService } from "./cart.service";
import { Connection } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

describe('CartService', () => {
	let service: CartService;
	let mockCartRepository;
	let mockProductRepository;
	let mockCartToProductRepository;
	let mockConnection;
	let mockEntityManager;

	beforeEach(async () => {
		mockCartRepository = {
			findOne: jest.fn(),
			save: jest.fn(),
		};

		mockProductRepository = {
			findOne: jest.fn(),
			save: jest.fn(),
		};

		mockCartToProductRepository = {
			findOne: jest.fn(),
			save: jest.fn(),
			remove: jest.fn(),
		};

		mockConnection = {
			transaction: jest.fn().mockImplementation((cb) => cb(mockEntityManager)),
		};

		mockEntityManager = {
			findOne: jest.fn(),
			save: jest.fn(),
			remove: jest.fn(),
			getRepository: jest.fn().mockReturnValue({
				createQueryBuilder: jest.fn().mockReturnValue({
					leftJoinAndSelect: jest.fn().mockReturnThis(),
					where: jest.fn().mockReturnThis(),
					getOne: jest.fn(),
				}),
			}),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CartService,
				{ provide: getRepositoryToken(Cart), useValue: mockCartRepository },
				{ provide: getRepositoryToken(Product), useValue: mockProductRepository },
				{ provide: getRepositoryToken(CartToProduct), useValue: mockCartToProductRepository },
				{ provide: Connection, useValue: mockConnection },
			],
		}).compile();

		service = module.get<CartService>(CartService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('createCart', () => {
		it('should create a new cart for the user', async () => {
			const userId = 1;
			const user = { id: userId, cart: null } as User;

			mockEntityManager.findOne.mockResolvedValueOnce(user);
			mockEntityManager.save.mockImplementation(entity => {
				entity.id = 1; // simulate setting the id property
				return Promise.resolve(entity);
			});

			const result = await service.createCart(userId, mockEntityManager);

			expect(mockEntityManager.findOne).toHaveBeenCalledWith(User, { where: { id: userId } });
			expect(mockEntityManager.save).toHaveBeenCalledWith(expect.any(Cart));
			expect(result).toMatchObject({
				user: { id: userId, cart: null },
				userId,
				cartToProducts: [],
			});
		});
	});

	// describe('addProductToCart', () => {
	// 	it('should add product to cart', async () => {
	// 		const userId = 1;
	// 		const productId = 'product-id';
	// 		const quantity = 5;
	// 		const user = { id: userId, cart: null } as User;
	// 		const cart = { id: 1, userId, cartToProducts: [] } as Cart;
	// 		const product = { id: productId, stockQuantity: 20 } as Product;
	// 		const cartToProduct = { cart, product, quantity: 5 } as CartToProduct;

	// 		mockEntityManager.findOne.mockImplementation((entity, options) => {
	// 			if (entity === User) return user;
	// 			if (entity === Cart) return cart;
	// 			if (entity === Product) return product;
	// 			if (entity === CartToProduct) return cartToProduct;
	// 		});

	// 		mockEntityManager.getRepository(Cart).createQueryBuilder().getOne.mockResolvedValueOnce(cart);

	// 		const result = await service.addProductToCart(userId, productId, quantity);

	// 		expect(mockEntityManager.findOne).toHaveBeenCalledTimes(4); // User, Cart, Product, CartToProduct
	// 		expect(mockEntityManager.save).toHaveBeenCalledTimes(3);
	// 		expect(result).toEqual(expect.any(Object)); // Adjusted to match the return type
	// 	});

	// 	it('should throw NotFoundException if the product is not found', async () => {
	// 		const userId = 1;
	// 		const productId = 'product-id';
	// 		const quantity = 5;
	// 		const user = { id: userId, cart: null } as User;
	// 		const cart = { id: 1, userId, cartToProducts: [] } as Cart;

	// 		mockEntityManager.findOne.mockImplementation((entity, options) => {
	// 			if (entity === User) return user;
	// 			if (entity === Cart) return cart;
	// 			if (entity === Product) return null;
	// 		});

	// 		await expect(service.addProductToCart(userId, productId, quantity)).rejects.toThrow(NotFoundException);
	// 	});
	// });

	// describe('updateProductQuantity', () => {
	// 	it('should throw NotFoundException if the cart is not found', async () => {
	// 		const userId = 1;
	// 		const productId = 'product-id';
	// 		const newQuantity = 5;

	// 		mockEntityManager.findOne.mockImplementation((entity, options) => {
	// 			if (entity === User) return { id: userId, cart: null } as User;
	// 			if (entity === Cart) return null;
	// 		});

	// 		await expect(service.updateProductQuantity(userId, productId, newQuantity)).rejects.toThrow(NotFoundException);
	// 	});
	// });
});
