import { Repository, EntityManager } from 'typeorm';
import { Cart } from './cart.entity';

export class CartRepository extends Repository<Cart> {
	constructor(private entityManager: EntityManager) {
		super(Cart, entityManager);
	}
}
