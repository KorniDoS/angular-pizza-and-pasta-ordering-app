import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: any[]=[];

  public _cartSubject$ = new BehaviorSubject<any[]>([]);

  constructor() { 

  }

  getCart(){
    return this.cart.slice();
  }

  addItemToCart(item: any){
    this.cart.push(item);
    this._cartSubject$.next(this.cart);
  }

  updateCartItem(id: number, item: any ){
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
