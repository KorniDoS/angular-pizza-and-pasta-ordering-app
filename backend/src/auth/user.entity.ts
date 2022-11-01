import { Cart } from 'src/cart/cart.entity';
import { Pasta } from 'src/pasta/pasta.entity';
import { Pizza } from 'src/pizza/pizza.entity';
import { CannotReflectMethodParameterTypeError, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role?: string;

  @OneToMany((_type) => Pizza, (pizza) => pizza.user, { eager: true })
  pizza: Pizza[];

  @OneToMany((_type)=> Pasta, (pasta)=> pasta.user, {eager: true})
  pasta: Pasta[];

  //one to one - cart
  @OneToOne((_type)=> Cart, (cart)=> cart.user, {eager: false})
  cart: Cart;
}
