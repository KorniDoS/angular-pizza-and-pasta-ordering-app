import { MenuService } from './../../services/menu.service';
import { CartService } from './../../services/cart.service';
import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

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
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    //console.log(this.data.item);

    if(this.data.item.type === 'Pizza'){
    this.pizzaExtraGroup.controls.crustType.patchValue(this.data.item.crust);
    this.pizzaExtraGroup.controls.size.patchValue(this.data.item.size);
    }
  
  }

  editMode: boolean = false;

  toppingsCopy?: any[] = [...this.data.item?.toppings];

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



  pushTopping(itemType: any) {
    let trimmed =
      itemType === 'Pizza'
        ? this.pizzaToppingGroup.controls.topping.value?.trim()
        : this.pastaForm.controls.ingredients.value?.trim();
    if (trimmed?.length === 0) {
      return;
    } else {
      this.toppingsCopy?.push(trimmed);
      this.pizzaToppingGroup.controls.topping.patchValue('');
      this.pastaForm.controls.ingredients.patchValue('');
    }

    console.log(this.toppingsCopy);
  }

  completeEditing(item: any, id: any) {
    if (item.type === 'Pizza') {
      let index = id;
      let editedObject = {
        name: item.name,
        type: item.type,
        toppings: this.toppingsCopy,
        crust: this.pizzaExtraGroup.controls.crustType.value,
        size: this.pizzaExtraGroup.controls.size.value,
        image: item.image,
        price: item.price,
        description: item.description,
      };
      this.menuService.updatePizzaItem(index, editedObject);
      console.log('Completed editing');
      this.dialogRef.close();
    } else {
      let index = id;
      let editedObject = {
        name: item.name,
        type: item.type,
        toppings: this.toppingsCopy,
        image: item.image,
        price: item.price,
        description: item.description,
      };
      this.menuService.updatePastaItem(index, editedObject);
      console.log('Completed editing');
      this.dialogRef.close();
    }
  }
  addToCart(item: any) {
    this.cartService.addItemToCart(item);
    this.dialogRef.close();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }
}
