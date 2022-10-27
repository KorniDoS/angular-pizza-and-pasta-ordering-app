import { SnackbarService } from './../../services/snackbar.service';
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
import { MatCellDef, MatTable, MatTableDataSource } from '@angular/material/table';
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
  dataSource = new MatTableDataSource<any>(this.cartItems);
  @ViewChild('table') table!: MatTable<any>;

  @ViewChildren('price') matCells?: QueryList<any>;
  constructor(public cartService: CartService, private router: Router, private snackbarService: SnackbarService) {}
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
    this.snackbarService.openSnackBar(`${item.name} deleted from cart`, 'OK', 5000);
    this.cartService.deleteItemFromCart(goodId, item);
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
   // alert('Order sent successfully!');
   this.snackbarService.openSnackBar('Order sent successfully! You will now be redirected to the home page!', 'Great!', 5000);
    form.resetForm();
    setTimeout(()=>{
      this.router.navigate(['/home']);
    }, 1500)

    //this.cartService.
    this.cartService.emptyCart();
  }

  ngOnDestroy(): void {
    this.cartSub$.unsubscribe();
  }
}
