import { NgForm, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService } from './../../services/cart.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  AfterViewInit,
  AfterViewChecked,
  AfterContentChecked,
  AfterContentInit,
  ViewChild,
} from '@angular/core';
import { isNgTemplate } from '@angular/compiler';
import { MatCellDef, MatTable } from '@angular/material/table';
import { MatTab } from '@angular/material/tabs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartSub$!: Subscription;
  cartItems: any[] = [];
  displayedColumns: string[] = ['name', 'image', 'quantity', 'price'];
  total: number = 0;
  once: boolean = false;
  showCheckoutForm: boolean = false;
  @ViewChild('table') table!: MatTable<any>;

  @ViewChildren('price') matCells?: QueryList<any>;
  constructor(public cartService: CartService, private router: Router) {}
  ngOnInit(): void {
    this.cartSub$ = this.cartService._cartSubject$.subscribe((response) => {
      this.cartItems = response;
      //console.log(this.cartItems);

      if (this.once === false) {
        this.cartItems
          .map((t) => [t.price, t.quantity])
          .forEach((item) => {
            this.total = this.total + Number(item[0]) * Number(item[1]);

            this.once = true;
          });
      }
    });
  }

  onDelete(item: any, id:number) {
   // console.log(id);

    let goodId = this.cartItems.findIndex(item=> item.id === id);
    console.log(goodId);
    this.cartService.deleteItemFromCart(goodId);
    this.total = 0;
    this.cartItems
      .map((t) => [t.price, t.quantity])
      .forEach((item) => {
        this.total = this.total + Number(item[0]) * Number(item[1]);
      });
    //this.cartService.updateCartItem(goodId, item);
    this.table.renderRows();
    //console.log(item, id);

  }

  onCheckout(){
    this.showCheckoutForm = !this.showCheckoutForm;
  }

  onChanged(id: any, element: any) {
    let realId = this.cartItems.findIndex(item=> item.id === id);
    this.total = 0;
    this.cartService.updateCartItem(realId, element);
    this.cartItems
      .map((t) => [t.price, t.quantity])
      .forEach((item) => {
        this.total = this.total + Number(item[0]) * Number(item[1]);
      });
    
  }

  onSubmit(form: NgForm){
    console.log(form.value);
    alert('Order sent successfully!');
    form.resetForm();
    setTimeout(()=>{
      this.router.navigate(['/home']);
    }, 1000)

    //this.cartService.
    this.cartService.emptyCart();
  }

  ngOnDestroy(): void {
    this.cartSub$.unsubscribe();
  }
}
