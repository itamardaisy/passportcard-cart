import { Entity, Column, ManyToMany, PrimaryGeneratedColumn, PrimaryColumn, OneToMany } from 'typeorm';
import { IsString, IsNotEmpty, IsNumber, IsPositive, IsInt, IsDate } from 'class-validator';
import { Cart } from '../cart/cart.entity';
import { CartToProduct } from '../cart/cart-product.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Product {
	@PrimaryGeneratedColumn('uuid')
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

	@OneToMany(() => CartToProduct, cartToProduct => cartToProduct.product)
	cartToProducts: CartToProduct[];
}
