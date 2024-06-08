import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { validate } from 'class-validator';
import { CreateProductDto } from './dto/create-product.dto';

const PAGENATION_LIMIT = 100;

@Injectable()
export class ProductService {
	constructor(
		@Inject('ProductRepository')
		private productRepository: ProductRepository,
	) { }

	async findAll(page: number): Promise<{ data: Product[], count: number, totalPages: number }> {
		const [data, count] = await this.productRepository.findAndCount({
			skip: (page - 1) * PAGENATION_LIMIT,
			take: PAGENATION_LIMIT,
		});
		const totalPages = Math.ceil(count / PAGENATION_LIMIT);
		return { data, count, totalPages };
	}

	async getProductById(id: string): Promise<Product> {
		const product = await this.productRepository.findOne({ where: { id } });
		if (!product) {
			throw new NotFoundException('Product not exists');
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
		product.carts = [];
		return product;
	}
}
