import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { AddNewItemDto } from './dto/add-new-item.dto';
import { AuthCredentialsDto } from './../auth/dto/auth-credentials.dto';
import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, QueryResult, Repository } from "typeorm";
import { Cart } from "./cart.entity";
import { User } from 'src/auth/user.entity';
import { stringify } from 'querystring';

@Injectable()
export class CartRepository extends Repository<Cart>{
    constructor(private dataSource: DataSource){
     super(Cart, dataSource.createEntityManager())   
    }


    async createEmptyCart(user: User){
        const {id } = user;

    console.log(id);
        const empty = this.create({products: [], user});

        await this.save(empty);


    
    }

    async getCart(user: User){
        const query = this.createQueryBuilder('cart');
        query.where('cart.userId = :id', {id: user.id});

        const cart = await query.getOne();

        return cart;
    }
    

    async addItemToCart(addNewItemDto: AddNewItemDto, user: User){

        const query = this.createQueryBuilder('cart');
        const {id, quantity} = addNewItemDto;
        query.where('cart.userId = :user_id', {user_id: user.id});
        const cart = await query.getOne();

        //cart.products = [...cart.products, {id: id, quantity: quantity}];
        cart.products.push({id: id, quantity: quantity});

        await this.save(cart);
        return cart;


    }

    async deleteItemFromCart(id: string, user: User){
        const query = this.createQueryBuilder('cart');

        query.where('cart.userId = :user_id', {user_id: user.id});

        const cart = await query.getOne();

        const deleteIndex = cart.products.findIndex(item=> item.id == id);

        if(deleteIndex !== -1){
            cart.products.splice(deleteIndex, 1);
        } else {
            throw new NotFoundException();
        }

        await this.save(cart);
    }

    async updateCartItem(updateCartItemDto: UpdateCartItemDto, user: User){

        const {id, quantity } = updateCartItemDto;
        const query = this.createQueryBuilder('cart');

        query.where('cart.userId = :user_id', {user_id: user.id});

        const cart = await query.getOne();

        const updateIndex = cart.products.findIndex(item=> item.id == id);

        if(updateIndex !== -1){
            cart.products[updateIndex] = {id: id, quantity: quantity}; 
            await this.save(cart);
        } else{
            throw new NotFoundException();
        }

       

       // return cart;
    }
}