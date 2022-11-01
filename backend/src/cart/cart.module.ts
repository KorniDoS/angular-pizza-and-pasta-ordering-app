import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Cart } from './cart.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [/*ConfigModule*/TypeOrmModule.forFeature([Cart]), AuthModule],
  controllers: [CartController],
  providers: [CartService, CartRepository],
})
export class CartModule {}