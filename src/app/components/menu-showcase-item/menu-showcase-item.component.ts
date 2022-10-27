import { SnackbarService } from './../../services/snackbar.service';
import { Pasta } from './../../models/pasta.model';
import { Pizza } from './../../models/pizza.model';
import { CartService } from './../../services/cart.service';

import { Component, Input, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-menu-showcase-item',
  templateUrl: './menu-showcase-item.component.html',
  styleUrls: ['./menu-showcase-item.component.scss']
})
export class MenuShowcaseItemComponent implements OnInit {
  @Input() menuItem!: any;
  @Input() id!: any;
  addedToCart?: boolean;
  cart: Pizza[] | Pasta[] = [];
  constructor(private cartService: CartService, private snackbarService: SnackbarService) { }

  ngOnInit(): void {

    this.cart = this.cartService.getCart();
    if(this.cart.includes(this.menuItem)){
      this.addedToCart = true;
    } else {
      this.addedToCart = false;
    }
  }

  onAddToCart(item: any){
    let items = this.cartService.getCart();

    if(items.includes(item)){
      this.addedToCart = false;
      return;
    } else {
      this.addedToCart = true;
      item.quantity = 1;
      this.snackbarService.openSnackBar(`${item.name} added to cart!`, 'OK', 5000);
       this.cartService.addItemToCart(item);
    }
   
  }

}
