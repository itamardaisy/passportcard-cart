import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Cart, CartRepository]),
		ProductModule,
		UserModule,
	],
	providers: [CartService],
	controllers: [CartController],
})
export class CartModule { }

