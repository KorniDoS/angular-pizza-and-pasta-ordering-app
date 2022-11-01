import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CrustType, Size, TrueOrFalse } from './pizza-meta.enum';

@Entity()
export class Pizza {
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
  size: Size;

  @Column()
  crustType: CrustType;

  @Column()
  price: string;

  @Column()
  global: TrueOrFalse;

  @ManyToOne((_type) => User, (user) => user.pizza, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
