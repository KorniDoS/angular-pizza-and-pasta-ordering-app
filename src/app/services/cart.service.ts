import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Pasta } from '../models/pasta.model';
import { Pizza } from '../models/pizza.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Pizza[] | Pasta[] = [];

  public _cartSubject$ = new BehaviorSubject<Pizza[] | Pasta[]>([]);

  constructor() { 

  }

  getCart(){
    return this.cart.slice();
  }

  addItemToCart(item: Pizza | Pasta){
    this.cart.push(item);
    this._cartSubject$.next(this.cart);
  }

  updateCartItem(id: number, item: Pizza | Pasta ){
    this.cart[id] = item;
    this._cartSubject$.next(this.cart);
  }

  deleteItemFromCart(id: number){
    this.cart.splice(id, 1);
    this._cartSubject$.next(this.cart);
  }

  emptyCart(){
    this.cart = [];
    this._cartSubject$.next(this.cart);
  }
}
