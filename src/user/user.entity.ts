import { Type } from 'class-transformer';
import { Cart } from '../cart/cart.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	email: string;

	@OneToOne(() => Cart, cart => cart.user)
	cart: Cart;
}
