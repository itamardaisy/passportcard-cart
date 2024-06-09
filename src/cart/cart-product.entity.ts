import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../product/product.entity';
import { Exclude, Type } from 'class-transformer';

@Entity()
export class CartToProduct {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Cart, cart => cart.cartToProducts, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'cartId' })
	cart: Cart;

	@ManyToOne(() => Product, product => product.cartToProducts, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'productId' })
	product: Product;

	@Column()
	quantity: number;
}
