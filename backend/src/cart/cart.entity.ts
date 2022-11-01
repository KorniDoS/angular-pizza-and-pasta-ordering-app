import { Exclude } from "class-transformer";
import { User } from "src/auth/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('jsonb', {nullable: true})
    products: {id: string, quantity: string | number}[];


    //one to one
    @OneToOne((_type)=> User, (user)=> user.cart, {eager: true})
    @Exclude({ toPlainOnly: true })
    @JoinColumn()
    user: User;
}