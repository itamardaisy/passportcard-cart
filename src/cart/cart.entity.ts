import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, Column } from 'typeorm';

@Entity()
export class Cart {
	@PrimaryGeneratedColumn()
	id: string;

	@ManyToMany(() => Product, (product: Product) => product.carts)
	@JoinTable({ name: 'carts_to_products' })
	products: Product[];

	@OneToOne(() => User, (user: User) => user.cart)
	@JoinColumn({ name: 'userId' })
	user: User;

	@Column()
	userId: number;
}
