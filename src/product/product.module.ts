// src/product/product.module.js.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		TypeOrmModule.forFeature([Product]),
		ConfigModule,
	],
	providers: [
		ProductService,
		{
			provide: 'ProductRepository',
			useFactory: (entityManager: EntityManager) => {
				return new ProductRepository(entityManager);
			},
			inject: [EntityManager],
		},
	],
	controllers: [ProductController],
	exports: [ProductService],
})
export class ProductModule { }
