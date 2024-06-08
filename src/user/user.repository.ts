import { Repository, EntityManager } from 'typeorm';
import { User } from './user.entity';

export class UserRepository extends Repository<User> {
	constructor(private entityManager: EntityManager) {
		super(User, entityManager);
	}
}
