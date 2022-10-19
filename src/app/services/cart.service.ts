import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: {name: string, number: number}[]=[]

  public _cartSubject$ = new BehaviorSubject<{name: string, number: number}[]>([]);
  //public readonly todos: Observable<List<Todo>> = this._todos.asObservable();
  constructor() { 

  }

//initCart(){
 // return this.http.get<any[]>('assets/data/cart.json')
 //no need for initialisation as our cart is empty
 //}

  getCart(){
    return this.cart.slice();
  }

  addItemToCart(item: any){
    this.cart.push(item);
    this._cartSubject$.next(this.cart);
  }

  updateCartItem(id: number, item: {name: string, number: number} ){
    this.cart[id] = item;
    this._cartSubject$.next(this.cart);
  }

  deleteItemFromCart(id: number){
    this.cart.splice(id, 1);
    this._cartSubject$.next(this.cart);
  }
}
