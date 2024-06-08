import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) { }

	@Post()
	create(@Body() createProductDto: CreateProductDto): Promise<Product> {
		return this.productService.create(createProductDto);
	}

	@Get()
	async findAll(@Query('page') page: number = 1) {
		return this.productService.findAll(page);
	}
}