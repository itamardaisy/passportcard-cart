import { Entity, Column, ManyToMany, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
import { IsString, IsNotEmpty, IsNumber, IsPositive, IsInt, IsDate } from 'class-validator';
import { Cart } from '../cart/cart.entity';

@Entity()
export class Product {
	@PrimaryGeneratedColumn('uuid')
	@PrimaryColumn({ type: 'varchar', length: 50 })
	id: string;

	@Column()
	@IsString()
	@IsNotEmpty()
	name: string;

	@Column('double')
	@IsNumber()
	@IsPositive()
	price: number;

	@Column()
	@IsInt()
	@IsPositive()
	stockQuantity: number;

	@Column()
	@IsDate()
	expirationDate: Date;

	@ManyToMany(() => Cart, (cart: Cart) => cart.products)
	carts: Cart[];
}
