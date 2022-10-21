import { CartService } from './../../services/cart.service';

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-showcase-item',
  templateUrl: './menu-showcase-item.component.html',
  styleUrls: ['./menu-showcase-item.component.scss']
})
export class MenuShowcaseItemComponent implements OnInit {
  @Input() menuItem!: any;
  @Input() id!: any;
  addedToCart?: boolean;
  cart: any[] = [];
  constructor(private cartService: CartService) { }

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
       this.cartService.addItemToCart(item);
    }
   
  }

}
