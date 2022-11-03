import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Pasta } from '../models/pasta.model';
import { Pizza } from '../models/pizza.model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  backendApi: string = environment.backendAPIbaseUrl;
  changes = new BehaviorSubject<any>(null);
  private cart: Pizza[] | Pasta[] = [];

  public _cartSubject$ = new BehaviorSubject<Pizza[] | Pasta[]>([]);

  constructor(private http: HttpClient) { 

  }

  initCart(){
    return this.http.post(this.backendApi + '/cart/init',{});
  }

  getLocalCart(){
    return this.cart.slice();
  }


  getCart(){
    //this.http.get(environment.backendAPIbaseUrl + '')
    //return this.cart.slice();

    return this.http.get(this.backendApi + '/cart/get');
  }

  addItemToCart(item: Pizza | Pasta){
    const quantity = 1;
    const id = item.id;
    const type = item.type

    return this.http.post(this.backendApi + '/cart/add', {
      id: id,
      type: item.type,
      quantity: quantity
    })
    //this.cart.push(item);
   // this._cartSubject$.next(this.cart);


  }

  updateCartItem(id: number, item: Pizza | Pasta ){
    this.cart[id] = item;
    this._cartSubject$.next(this.cart);
  }

  deleteItemFromCart(id: number, item: Pizza | Pasta){
    let found = this.cart.indexOf(item);
    if(found === -1){
      return;
    } else {
    this.cart.splice(found, 1);
    this._cartSubject$.next(this.cart);
    }
   
  }

  emptyCart(){
    this.cart = [];
    this._cartSubject$.next(this.cart);
  }
}
