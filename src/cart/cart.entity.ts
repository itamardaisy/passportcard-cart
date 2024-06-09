import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { CartToProduct } from './cart-product.entity';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Cart {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToMany(() => CartToProduct, cartToProduct => cartToProduct.cart)
	cartToProducts: CartToProduct[];

	@OneToOne(() => User, user => user.cart)
	@JoinColumn({ name: 'userId' })
	user: User;

	@Column()
	@IsNotEmpty()
	userId: number;
}
