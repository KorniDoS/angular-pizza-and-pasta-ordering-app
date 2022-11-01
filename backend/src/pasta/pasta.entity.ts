import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrueOrFalse } from './true-false.enum';

@Entity()
export class Pasta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column('simple-array')
  toppings: string[];

  @Column()
  description?: string;

  @Column()
  price: string;

  @Column()
  global: TrueOrFalse;

  @ManyToOne((_type) => User, (user) => user.pasta, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
