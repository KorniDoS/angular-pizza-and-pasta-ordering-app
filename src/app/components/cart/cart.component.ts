import { SnackbarService } from './../../services/snackbar.service';
import { NgForm, ReactiveFormsModule } from '@angular/forms';
import {
  concat,
  concatMap,
  forkJoin,
  merge,
  mergeMap,
  Observable,
  Subscription,
  switchMap,
  switchMapTo,
} from 'rxjs';
import { CartService } from './../../services/cart.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap, map } from 'rxjs';
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
import { isNgTemplate, ThisReceiver } from '@angular/compiler';
import {
  MatCellDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatTab } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartSub$!: Subscription;
  cartItems: any[] = [];
  cartQuantities: any[] = [];
  cartObservables$: any[] = [];
  displayedColumns: string[] = ['name', 'image', 'quantity', 'price'];
  total: number = 0;
  once: boolean = false;
  showCheckoutForm: boolean = false;
  cartItemsObs$: any;
  onChangedSub$!: Subscription;
  //dataSource = new MatTableDataSource<any>(this.cartItems);
  @ViewChild('table') table!: MatTable<any>;

  @ViewChildren('price') matCells?: QueryList<any>;
  cartTableDataSource = new MatTableDataSource();
  constructor(
    public cartService: CartService,
    private router: Router,
    private snackbarService: SnackbarService,
    private spinner: NgxSpinnerService,
    private menuService: MenuService
  ) {}
  ngOnInit(): void {
    //  this.cartSub$ = this.cartService._cartSubject$
    //   .pipe(
    //   tap(() => {
    //     if (this.once === false) this.spinner.show();
    //   })
    //  )
    // .subscribe((response) => {
    //    this.cartItems = response;
    //console.log(this.cartItems);

    //  if (this.once === false) {
    //   setTimeout(() => {
    //     this.spinner.hide();
    //   }, 1000);

    //   forkJoin([this.cartService.getCart().pipe(mergeMap((cart:any, i)=>{
    //    console.log(cart);
    //    if(cart.products[i].type === 'Pizza'){
    //      console.log(cart.products[i].type);
    //       return this.menuService.getPizzaById(cart.products[i].id);
    //   } else {
    //      return this.menuService.getPastaById(cart.products[i].id);
    //    }

    //  }))]).subscribe(
    //    res=>{
    //     console.log(res);
    //      this.cartTableDataSource.data = res;
    //    }
    //   )

   // this.spinner.show();
   this.cartSub$ = this.cartService
      .getCart()
      .pipe(
        map((cart: any) => {
          let obs;
          for (let cartItem of cart.products) {
            console.log(cartItem.quantity);
            if (cartItem.type === 'Pizza') {
              obs = this.menuService.getPizzaById(cartItem.id);
              this.cartObservables$.push(obs);
              this.cartQuantities.push({
                id: cartItem.id,
                quantity: cartItem.quantity,
              });
            } else if(cartItem.type === 'Pasta') {
              obs = this.menuService.getPastaById(cartItem.id);
              this.cartQuantities.push({
                id: cartItem.id,
                quantity: cartItem.quantity,
              });
              this.cartObservables$.push(obs);
            }
          }
          this.cartItemsObs$ = merge(...this.cartObservables$);

          console.log(this.cartQuantities);

          // return this.cartItemsObs$;
        }),
        switchMap(() => this.cartItemsObs$)
      )
      .subscribe((res: any) => {
        console.log(this.cartQuantities);
        console.log(res.id);
        if (this.cartQuantities.find((item) => item.id == res.id)) {
          const found = this.cartQuantities.find((item) => item.id == res.id);

          let quantity = found.quantity;
          const newItem = { ...res, quantity };
          this.cartItems.push(newItem);
          this.cartTableDataSource.data = this.cartItems;
          this.cartService._cartSubject$.next(this.cartItems);
        }
        this.total = 0;
        // this.cartService.updateCartItem(realId, element);
         this.cartItems
           .map((t) => [t.price, t.quantity])
           .forEach((item) => {
             this.total = this.total + Number(item[0]) * Number(item[1]);
           });
        this.spinner.hide();
      });
  }

  onDelete(item: any, id: any) {
    // console.log(id);

    let goodId = this.cartItems.findIndex((item) => item.id === id);
    console.log(goodId);
    this.snackbarService.openSnackBar(
      `${item.name} deleted from cart`,
      'OK',
      5000
    );
    this.cartService.deleteItemFromCart(id, item)?.subscribe(res=> console.log(res));
    this.total = 0;
    this.cartItems
      .map((t) => [t.price, t.quantity])
      .forEach((item) => {
        this.total = this.total + Number(item[0]) * Number(item[1]);
      });
    //this.cartService.updateCartItem(goodId, item);
    this.cartItems.splice(goodId, 1);
    this.cartService._cartSubject$.next(this.cartItems);
    this.table.renderRows();
    //console.log(item, id);
  }

  onCheckout() {
    this.showCheckoutForm = !this.showCheckoutForm;
  }

  onChanged(id: any, element: any) {
    const quantity = element.quantity;
    const type = element.type;
    //let realId = this.cartItems.findIndex((item) => item.id === id);
    this.onChangedSub$ = this.cartService.updateCartItem(id, quantity, type).subscribe(res=>{
      this.onChangedSub$.unsubscribe();
    });

    //this.onChangedSub$.unsubscribe();
    this.total = 0;
   // this.cartService.updateCartItem(realId, element);
    this.cartItems
      .map((t) => [t.price, t.quantity])
      .forEach((item) => {
        this.total = this.total + Number(item[0]) * Number(item[1]);
      });
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    // alert('Order sent successfully!');
    this.snackbarService.openSnackBar(
      'Order sent successfully! You will now be redirected to the home page!',
      'Great!',
      5000
    );
    form.resetForm();
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1500);

    //this.cartService.
    //this.cartService.emptyCart();
    this.cartService._cartSubject$.next([]);
  }


  getTotal(row: any){
    console.log(row);
    return (parseInt(row.first) + parseInt(row.second));
  }
  ngOnDestroy(): void {
    this.cartSub$.unsubscribe();
   // this.onChangedSub$.unsubscribe();
  }
}
