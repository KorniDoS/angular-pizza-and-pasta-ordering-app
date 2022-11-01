import { AddNewItemDto } from './dto/add-new-item.dto';
import { CartRepository } from 'src/cart/cart.repository';
import { Injectable } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService{
    constructor(private readonly cartRepository: CartRepository){}

    getCart(user: User){
        return this.cartRepository.getCart(user);
    }

    createEmptyCart(user: User){
        return this.cartRepository.createEmptyCart(user);
    }

    addItemToCart(addNewItemDto: AddNewItemDto, user: User){
       // const {id, quantity } = addNewItemDto;

        //const record = this.cartRepository.findOne({where: {id}});

       //const record = this.cartRepository.findOne({where: {id, user}});
        return this.cartRepository.addItemToCart(addNewItemDto, user);

    }

    deleteItemFromCart(id: string, user: User){
        return this.cartRepository.deleteItemFromCart(id, user);
    }

    updateCartitem(updateCartItemDto: UpdateCartItemDto, user: User){
        return this.cartRepository.updateCartItem(updateCartItemDto, user);
    }
}