import { Subscription } from 'rxjs';
import { CartService } from './../../services/cart.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  cartSub$!: Subscription;
  cartItems: any[] = [];
  displayedColumns: string[] = ['name', 'image', 'quantity', 'price'];
  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.cartSub$ = this.cartService._cartSubject$.subscribe(
      response=>{
        this.cartItems = response;
      }
    );
  }
  ngOnDestroy(): void {
    this.cartSub$.unsubscribe();
  }

}
