import { SnackbarService } from './../../services/snackbar.service';
import { Pasta } from './../../models/pasta.model';
import { Pizza } from './../../models/pizza.model';
import { CartService } from './../../services/cart.service';

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-showcase-item',
  templateUrl: './menu-showcase-item.component.html',
  styleUrls: ['./menu-showcase-item.component.scss'],
})
export class MenuShowcaseItemComponent implements OnInit {
  @Input() menuItem!: any;
  @Input() id!: any;
  addedToCart?: boolean;
  cart: Pizza[] | Pasta[] = [];
  cartItem?: any;
  constructor(
    private cartService: CartService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    if (this.cart.includes(this.menuItem)) {
      this.addedToCart = true;
    } else {
      this.addedToCart = false;
      this.menuItem.quantity = 0;
    }
  }

  onAddToCart(item: any) {
    let items = this.cartService.getCart();
    if (items.includes(item)) {
      if (this.menuItem.quantity < 5) {
        this.menuItem.quantity++;
        this.addedToCart = true;
      } else {
        this.snackbarService.openSnackBar(
          `${item.name} cannot be added more than 5 times!`,
          'OK',
          5000
        );
      }
    } else {
      this.addedToCart = true;
      this.menuItem.quantity = 1;
      this.snackbarService.openSnackBar(
        `${item.name} added to cart!`,
        'OK',
        5000
      );
      this.cartService.addItemToCart(item);
    }
  }

  onAddToCartToggle() {
    this.addedToCart = true;
    this.menuItem.quantity = 1;
    this.cartService.addItemToCart(this.menuItem);
    this.snackbarService.openSnackBar(
      `${this.menuItem.name} added to cart ${this.menuItem.quantity} times!`,
      'OK',
      5000
    );
  }

  onDecrease() {
    if (this.menuItem.quantity > 1) {
      this.menuItem.quantity--;
      this.snackbarService.openSnackBar(
        `${this.menuItem.name} deleted from cart! Remaining: ${this.menuItem.quantity}`,
        'OK',
        5000
      );
    } else if (this.menuItem.quantity === 1) {
      console.log('At 0');

      this.snackbarService.openSnackBar(
        `${this.menuItem.name} deleted from cart!`,
        'OK',
        5000
      );
      this.cartService.deleteItemFromCart(this.id, this.menuItem);
      this.addedToCart = false;
    }
  }

  onIncrease() {
    if (this.menuItem.quantity < 5) {
      this.menuItem.quantity++;
      this.snackbarService.openSnackBar(
        `${this.menuItem.name} added to cart ${this.menuItem.quantity} times!`,
        'OK',
        5000
      );
    } else {
      this.snackbarService.openSnackBar(
        `${this.menuItem.name} cannot be added more than 5 times!`,
        'OK',
        5000
      );
    }
  }
}
