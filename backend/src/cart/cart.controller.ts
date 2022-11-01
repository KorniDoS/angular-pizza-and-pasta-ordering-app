import { AddNewItemDto } from './dto/add-new-item.dto';
import { Body, Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/auth/user.entity";
import { CartService } from "./cart.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
@UseGuards(AuthGuard())
export class CartController{
    constructor(private cartService: CartService){}


    @Get('/get')
    getCart(@GetUser() user: User){
        return this.cartService.getCart(user);
    }
    
    @Post('/init')
    createEmptyCart(@GetUser() user: User){
        return this.cartService.createEmptyCart(user);
    }

    @Post('/add')
    addItemToCart(@Body() addNewItemDto: AddNewItemDto, @GetUser() user:User){
        return this.cartService.addItemToCart(addNewItemDto, user);

    }

    @Delete('/remove')
    deleteItemFromCart(@Body('id') id: string, @GetUser() user: User){
        return this.cartService.deleteItemFromCart(id, user);
    }

    @Patch('/update')
    updateCartItem(@Body() updateCartItem: UpdateCartItemDto, @GetUser() user: User){

        return this.cartService.updateCartitem(updateCartItem, user);

    }
}