import { AuthService } from 'src/app/services/auth.service';
import { concatMap } from 'rxjs';
import { SnackbarService } from './../../services/snackbar.service';
import { Pasta } from './../../models/pasta.model';
import { Pizza } from './../../models/pizza.model';
import { MenuService } from './../../services/menu.service';
import { CartService } from './../../services/cart.service';
import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private menuService: MenuService,
    private cartService: CartService,
    private _formBuilder: FormBuilder,
    private snackBarService: SnackbarService,
    private authService: AuthService,
  ) {}

  addItemToCartSub?: Subscription;
  ngOnInit(): void {
    //console.log(this.data.item);

    if(this.data.item.type === 'Pizza'){
    this.pizzaExtraGroup.controls.crustType.patchValue(this.data.item.crust);
    this.pizzaExtraGroup.controls.size.patchValue(this.data.item.size);
    }

    console.log(this.isAdmin);

    this.cartService.getCart().subscribe((res:any)=>{

      this.cartItems = res["products"];
    })

   // t//his.cartItems = this.cartService.getLocalCart()
  
  }

  get isAdmin(){
    return this.authService.isAdmin;
  }


  cartItems: any[] = []

  editMode: boolean = false;

  toppingsCopy: string[] = [...this.data.item?.toppings];

  pizzaToppingGroup = this._formBuilder.group({
    topping: [''],
  });
  pizzaExtraGroup = this._formBuilder.group({
    crustType: ['', Validators.required],
    size: ['', Validators.required],
  });

  pastaForm = this._formBuilder.group({
    ingredients: [''],
  });



  pushTopping(itemType: string) {
    let trimmed =
      itemType === 'Pizza'
        ? this.pizzaToppingGroup.controls.topping.value?.trim()
        : this.pastaForm.controls.ingredients.value?.trim();
    if (trimmed?.length === 0) {
      return;
    } else {
      this.toppingsCopy?.push(trimmed!);
      this.pizzaToppingGroup.controls.topping.patchValue('');
      this.pastaForm.controls.ingredients.patchValue('');
    }

    console.log(this.toppingsCopy);
  }

  completeEditing(item: any, id: any) {
    console.log(id);
    if (item.type === 'Pizza') {
     // let realId = this.menuService.getPizzaMenu().findIndex((item: Pizza)=> item.id === id);
     // console.log(realId);
      //let index = id;
      // let editedObject: Pizza = {
      //   id: id,
      //   name: item.name,
      //   type: item.type,
      //   toppings: this.toppingsCopy,
      //   crust: this.pizzaExtraGroup.controls.crustType.value!,
      //   size: this.pizzaExtraGroup.controls.size.value!,
      //   image: item.image,
      //   price: item.price,
      //   description: item.description,
      //   quantity: 1
      // };

      let editedPizza: Pizza = {
        id: id,
        name: item.name,
        type: item.type,
        toppings: this.toppingsCopy,
        crust: this.pizzaExtraGroup.controls.crustType.value!,
        size: this.pizzaExtraGroup.controls.size.value!,
        image: item.image,
        price: item.price,
        description: item.description,
        quantity: 1
      }

      this.menuService.updatePizzaItem(id, editedPizza).subscribe(res=>{
        console.log('Successfully update item with id', id);

        //this.menuService.newItems.complete();
        this.menuService.newItems.next(null);
      });


      //this.menuService.updatePizzaItem(realId, editedObject);


      this.snackBarService.openSnackBar(`${editedPizza.name} was successfully updated!`, 'OK', 5000);
      console.log('Completed editing');
      this.dialogRef.close();
    } else {
   //   console.log(id);
     // let realId = this.menuService.getPastaMenu().findIndex((item:Pasta)=> item.id === id);
      let editedPasta: Pasta = {
        id: id,
        name: item.name,
        type: item.type,
        toppings: this.toppingsCopy,
        image: item.image,
        price: item.price,
        description: item.description,
        quantity: 1
      };
      this.menuService.updatePastaItem(id, editedPasta).subscribe(res=>{
        this.menuService.newItems.next(null);
      });
      this.snackBarService.openSnackBar(`${editedPasta.name} was successfully updated!`, 'OK', 5000);
      console.log('Completed editing');
      this.dialogRef.close();
    }
  }


  // addToCart(item: any) {
  //   if(!this.cartService.getCart().includes(item)){
  //     item.quantity = 1;
  //     this.cartService.addItemToCart(item);
  //     this.snackBarService.openSnackBar(`${item.name} successfully added to cart!`, 'OK', 5000);
  //     //this.SnackbarService
  //   }

  //   this.dialogRef.close();
  // }


  addToCart(item: any){
    console.log(item);
    if(this.cartItems.find(items=> items.id === item.id)){
      this.snackBarService.openSnackBar(`${item.name} cannot be added multiple times to cart. If you want to order a bigger quantity, check out your cart!`, 'I understand.', 10000);
    //  console.log(item);
      return;
    } else {
     this.addItemToCartSub = this.cartService.addItemToCart(item).subscribe(res=>{
      //  console.log(item);
      //  console.log(res);
      this.snackBarService.openSnackBar(`${item.name} successfully added to cart!`, 'OK', 5000);
    
      this.cartItems.push(item);
        console.log('Item added to cart');
        this.cartService._cartSubject$.next(this.cartItems);
        console.log(this.cartItems);


        this.addItemToCartSub?.unsubscribe();
      })
    }

    this.dialogRef.close();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }
}
