import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Pasta } from '../models/pasta.model';
import { Pizza } from '../models/pizza.model';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  backendApi: string = environment.backendAPIbaseUrl;
  changes = new BehaviorSubject<any>(null);
  private cart: Pizza[] | Pasta[] = [];
  smallSub$!: Subscription;
  public _cartSubject$ = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {
    this.init().subscribe((res: any) => {
      this._cartSubject$.next(res.products);
    });
  }

  init() {
    return this.getCart();
  }

  initCart() {
    return this.http.post(this.backendApi + '/cart/init', {});
  }

  getLocalCart() {
    return this.cart.slice();
  }

  getCart() {
    //this.http.get(environment.backendAPIbaseUrl + '')
    //return this.cart.slice();

    return this.http.get(this.backendApi + '/cart/get');
  }

  addItemToCart(item: Pizza | Pasta) {
    const quantity = 1;
    const id = item.id;
    const type = item.type;

    return this.http.post(this.backendApi + '/cart/add', {
      id: id,
      type: item.type,
      quantity: quantity,
    });
    //this.cart.push(item);
    // this._cartSubject$.next(this.cart);
  }

  updateCartItem(id: string, quantity: number, type: string) {
    //this.cart[id] = item;
    return this.http.patch(this.backendApi + '/cart/update', {
      id: id,
      type: type,
      quantity: quantity,
    });
    //this._cartSubject$.next(this.cart);
  }

  deleteItemFromCart(id: any, item: Pizza | Pasta) {
    //let found = this.cart.indexOf(item);
    //  if(found === -1){
    //   return;
    // } else {
    // this.cart.splice(found, 1);
    // this._cartSubject$.next(this.cart);

    // }

    return this.http.delete(this.backendApi + '/cart/remove', {
      body: { id: id },
    });
  }

  emptyCart() {
    this.cart = [];
    this._cartSubject$.next(this.cart);
  }
}
