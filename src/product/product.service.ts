import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { validate } from 'class-validator';
import { CreateProductDto } from './dto/create-product.dto';

const PAGINATION_LIMIT = 100;

@Injectable()
export class ProductService {
	constructor(
		@Inject('ProductRepository')
		private productRepository: ProductRepository,
	) { }

	async findAll(page: number): Promise<{ data: Product[], count: number, totalPages: number }> {
		if (page < 1) {
			throw new Error('Page number must be greater than 0');
		}

		const [data, count] = await this.productRepository.findAndCount({
			skip: (page - 1) * PAGINATION_LIMIT,
			take: PAGINATION_LIMIT,
		});
		const totalPages = Math.ceil(count / PAGINATION_LIMIT);
		return { data, count, totalPages };
	}

	async getProductById(id: string): Promise<Product> {
		const product = await this.productRepository.findOne({ where: { id } });
		if (!product) {
			throw new NotFoundException('Product not found');
		}
		return product;
	}

	async create(createProductDto: Partial<CreateProductDto>): Promise<Product> {
		const productEntity = this.convertDtoToEntity(createProductDto);
		const product = this.productRepository.create(productEntity);
		const errors = await validate(product);
		if (errors.length > 0 || !product) {
			throw new Error(`Validation failed: ${errors}`);
		}
		return this.productRepository.save(product);
	}

	private convertDtoToEntity(createProductDto: Partial<CreateProductDto>): Product {
		const product = new Product();
		product.name = createProductDto.name;
		product.price = createProductDto.price;
		product.stockQuantity = createProductDto.stockQuantity;
		product.expirationDate = createProductDto.expirationDate;
		product.cartToProducts = [];
		return product;
	}
}
