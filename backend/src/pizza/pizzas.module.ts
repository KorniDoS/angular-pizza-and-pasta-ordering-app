import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Pizza } from './pizza.entity';
import { PizzasController } from './pizzas.controller';
import { PizzasRepository } from './pizzas.repository';
import { PizzasService } from './pizzas.service';
 import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [/*ConfigModule*/TypeOrmModule.forFeature([Pizza]), AuthModule],
  controllers: [PizzasController],
  providers: [PizzasService, PizzasRepository],
})
export class PizzasModule {}