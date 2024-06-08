import { Repository, EntityManager } from 'typeorm';
import { Product } from './product.entity';

export class ProductRepository extends Repository<Product> {
	constructor(private entityManager: EntityManager) {
		super(Product, entityManager);
	}
}
