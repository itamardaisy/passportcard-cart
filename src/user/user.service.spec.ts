import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { NotFoundException } from '@nestjs/common';
import { User } from './user.entity';

const mockUserRepository = () => ({
	find: jest.fn(),
	findOne: jest.fn(),
	save: jest.fn(),
	delete: jest.fn(),
});

describe('UserService', () => {
	let userService: UserService;
	let userRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{ provide: UserRepository, useFactory: mockUserRepository },
			],
		}).compile();

		userService = module.get<UserService>(UserService);
		userRepository = module.get<UserRepository>(UserRepository);
	});

	describe('findAll', () => {
		it('should return an array of users', async () => {
			const expectedResult = [new User(), new User()];
			userRepository.find.mockResolvedValue(expectedResult);

			expect(await userService.findAll()).toBe(expectedResult);
		});
	});

	describe('findOne', () => {
		it('should retrieve a single user', async () => {
			const expectedUser = new User();
			userRepository.findOne.mockResolvedValue(expectedUser);

			expect(await userService.findOne(1)).toBe(expectedUser);
		});

		it('should throw an error if user not found', async () => {
			userRepository.findOne.mockResolvedValue(null);

			await expect(userService.findOne(1)).rejects.toThrow(NotFoundException);
		});
	});

	describe('create', () => {
		it('should successfully create a user', async () => {
			const user = new User();
			userRepository.save.mockResolvedValue(user);

			expect(await userService.create(user)).toBe(user);
		});
	});

	describe('remove', () => {
		it('should successfully remove a user', async () => {
			userRepository.delete.mockResolvedValue(undefined);

			expect(await userService.remove(1)).toBe(undefined);
		});
	});
});
