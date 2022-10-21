import { MenuService } from './../../services/menu.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  Validators,
  FormBuilder,
  AbstractControl,
  FormArray,
} from '@angular/forms';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
})
export class WizardComponent implements OnInit {
  constructor(private fb: FormBuilder, private menuService: MenuService) {}

  ngOnInit(): void {
    this.FormArr?.get([0])?.valueChanges.subscribe((res: any) => {
      this.newItemType = res;
      //this.wizardForm.reset();
      this.newToppingsArr = [];
      this.newToppingsArrPasta = [];
      console.log(this.newItemType);
    });

    this.pizzaMenu = this.menuService.getPizzaMenu();
    this.pastaMenu = this.menuService.getPastaMenu();
  }
  pizzaMenu: any[] = [];
  pastaMenu: any[] = [];
  newItemType?: any;
  newToppingsArr: any[] = [];
  newToppingsArrPasta: any[] = [];

  removeData() {}

  wizardForm = this.fb.group({
    formArr: this.fb.array([
      this.fb.group({
        type: ['', Validators.required],
      }),
      this.fb.group({
        name: ['', Validators.required],
        price: ['', Validators.required],
      }),
      this.fb.group({
        toppings: [
          '',
          this.newItemType === 'pizza' ? Validators.required : null,
        ],
        size: ['', this.newItemType === 'pizza' ? Validators.required : null],
        crustType: [
          '',
          this.newItemType === 'pizza' ? Validators.required : null,
        ],
      }),
      this.fb.group({
        toppings: [
          '',
          this.newItemType === 'pasta' ? Validators.required : null,
        ],
      }),
      this.fb.group({
        description: [
          '',
          this.newItemType === 'pasta' ? Validators.required : null,
        ],
      }),
    ]),
  });

  get FormArr(): AbstractControl | null {
    return this.wizardForm.get('formArr') as FormArray;
  }

  addIngredient() {
    this.newToppingsArrPasta.push(this.FormArr?.get([3])?.value.toppings);
    console.log(this.newToppingsArrPasta);
  }
  addTopping() {
    this.newToppingsArr.push(this.FormArr?.get([2])?.value.toppings);
    console.log(this.newToppingsArr);
  }
  onFinish() {
    let newItem;
    let type = this.FormArr?.value[0]?.type;


    if (type === 'pizza') {
      let newIndex =  Math.max(...this.pizzaMenu.map(item => item.id)) + 1;
      console.log(newIndex);
      let name = this.FormArr?.value[1]?.name;
      let price = this.FormArr?.value[1]?.price;
      let crustType = this.FormArr?.value[2]?.crustType;
      let size = this.FormArr?.value[2]?.size;

      newItem = {
        id: newIndex,
        name: name,
        type: 'Pizza',
        price: price,
        toppings: this.newToppingsArr,
        crust: crustType,
        size: size,
        image: 'assets/images/pizza-stock.jpg',
        description: '',
      };

      console.log(newItem);
      this.menuService.addPizzaItem(newItem);
      //  }
    } else if (type === 'pasta') {
      let newIndex =  Math.max(...this.pastaMenu.map(item => item.id)) + 1;
      let name = this.FormArr?.value[1]?.name;
      let price = this.FormArr?.value[1]?.price;
      let description = this.FormArr?.value[4]?.description;

      newItem = {
        id: newIndex,
        name: name,
        type: 'Pasta',
        price: price,
        toppings: this.newToppingsArrPasta,
        image: 'assets/images/pasta-stock.jpg',
        description: description,
      };

      this.menuService.addPastaItem(newItem);
      console.log(newItem);
    }

    // console.log(this.FormArr?.value);
  }
}
