import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
	) { }

	public async findAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	public async findOne(id: number): Promise<User> {
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}
		return user;
	}

	public async create(user: User): Promise<User> {
		return this.userRepository.save(user);
	}

	public async remove(id: number): Promise<void> {
		await this.userRepository.delete(id);
	}
}
