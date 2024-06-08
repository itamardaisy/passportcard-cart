import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { plainToClass } from 'class-transformer';

const mockProductRepository = () => ({
	findAndCount: jest.fn(),
	findOne: jest.fn(),
	create: jest.fn(),
	save: jest.fn(),
});

describe('ProductService', () => {
	let productService: ProductService;
	let productRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProductService,
				{ provide: 'ProductRepository', useFactory: mockProductRepository },
			],
		}).compile();

		productService = module.get<ProductService>(ProductService);
		productRepository = module.get('ProductRepository');
	});

	it('should be defined', () => {
		expect(productService).toBeDefined();
	});

	describe('create', () => {
		it('should successfully create a product', async () => {
			const createProductDto: CreateProductDto = {
				name: 'Product 1',
				price: 10.99,
				stockQuantity: 100,
				expirationDate: new Date('2025-12-31'),
			};

			const product = plainToClass(Product, createProductDto);
			productRepository.create.mockReturnValue(product);
			productRepository.save.mockResolvedValue(product);

			const result = await productService.create(createProductDto);
			expect(result).toEqual(product);
		});

		it('should throw an error if validation fails', async () => {
			const createProductDto: CreateProductDto = {
				name: '',
				price: -10,
				stockQuantity: -100,
				expirationDate: new Date('2025-12-31'),
			};

			const invalidProduct = plainToClass(Product, createProductDto);
			productRepository.create.mockReturnValue(invalidProduct);

			await expect(productService.create(createProductDto)).rejects.toThrowError(
				'Validation failed',
			);
		});
	});
});
