import { SnackbarService } from './../../services/snackbar.service';
import { Subscription } from 'rxjs';
import { Pasta } from './../../models/pasta.model';
import { Pizza } from './../../models/pizza.model';
import { MenuService } from './../../services/menu.service';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  OnDestroy,
  EventEmitter,
  Output,
} from '@angular/core';
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
export class WizardComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private snackbarService: SnackbarService
  ) {}

  formArrSub$?: Subscription;
  ngOnInit(): void {
    this.formArrSub$ = this.FormArr?.get([0])?.valueChanges.subscribe(
      (res: any) => {
        this.newItemType = res;
        //this.wizardForm.reset();
        this.newToppingsArr = [];
        this.newToppingsArrPasta = [];
        //console.log(this.newItemType);
      }
    );
  }

  // pizzaMaximumId: number = 0;
  // pastaMaximumId: number = 0;
  // menuItems: any[] = [];
  //pizzaMenu: Pizza[] = [];
  //pastaMenu: Pasta[] = [];
  newItemType?: string | any;
  newToppingsArr: string[] = [];
  newToppingsArrPasta: string[] = [];

  @Output() done: EventEmitter<boolean> = new EventEmitter<boolean>();

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
    let trimmed = this.FormArr?.get([3])?.value.toppings.trim();

    if (trimmed.length === 0) {
      return;
    } else {
      if (
        this.newToppingsArrPasta.includes(
          this.FormArr?.get([3])?.value.toppings.toLowerCase()
        )
      ) {
        this.snackbarService.openSnackBar(
          "Can't add the same ingredient twice or more!",
          'OK',
          5000
        );
      } else {
        this.newToppingsArrPasta.push(
          this.FormArr?.get([3])?.value.toppings.toLowerCase()
        );
        this.snackbarService.openSnackBar(
          `${this.FormArr?.get([3])?.value.toppings} added as ingredient.`,
          'OK',
          2000
        );
      }
      // this.newToppingsArrPasta.push(this.FormArr?.get([3])?.value.toppings);
      console.log(this.newToppingsArrPasta);
    }
  }
  addTopping() {
    let trimmed = this.FormArr?.get([2])?.value.toppings.trim();

    if (trimmed.length === 0) {
      return;
    } else {
      if (
        this.newToppingsArr.includes(
          this.FormArr?.get([2])?.value.toppings.toLowerCase()
        )
      ) {
        this.snackbarService.openSnackBar(
          "Can't add the same topping twice or more!",
          'OK',
          5000
        );
        return;
      } else {
        this.newToppingsArr.push(
          this.FormArr?.get([2])?.value.toppings.toLowerCase()
        );
        this.snackbarService.openSnackBar(
          `${this.FormArr?.get([2])?.value.toppings} added as topping.`,
          'OK',
          2000
        );
      }

      console.log(this.newToppingsArr);
    }
  }

  onFinish() {
    let newItem;
    let type = this.FormArr?.value[0]?.type;

    if (type === 'pizza') {
      // let newIndex =
      //   this.pizzaMaximumId > this.pastaMaximumId
      //     ? this.pizzaMaximumId + 1
      //     : this.pastaMaximumId + 1;
      // console.log(newIndex);
      let name = this.FormArr?.value[1]?.name;
      let price = this.FormArr?.value[1]?.price;
      let crustType = this.FormArr?.value[2]?.crustType;
      let size = this.FormArr?.value[2]?.size;

      newItem = {
        // id: newIndex,
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
      this.menuService.addPizzaItem(newItem).subscribe((res) => {
        console.log('Successfully added');
        this.menuService.newItems.next(null);
      });
      this.snackbarService.openSnackBar(
        `${newItem.name} added into the menu!`,
        'OK',
        5000
      );
    } else if (type === 'pasta') {
      // let newIndex =
      //   this.pizzaMaximumId > this.pastaMaximumId
      //     ? this.pizzaMaximumId + 1
      //     : this.pastaMaximumId + 1;
      let name = this.FormArr?.value[1]?.name;
      let price = this.FormArr?.value[1]?.price;
      let description = this.FormArr?.value[4]?.description;

      newItem = {
        name: name,
        type: 'Pasta',
        price: price,
        toppings: this.newToppingsArrPasta,
        image: 'assets/images/pasta-stock.jpg',
        description: description,
      };

      this.menuService.addPastaItem(newItem).subscribe((res) => {
        this.menuService.newItems.next(null);
      });

      this.snackbarService.openSnackBar(
        `${newItem.name} added into the menu!`,
        'OK',
        5000
      );
      console.log(newItem);
    }

    this.done.emit(true);
  }

  ngOnDestroy(): void {
    this.formArrSub$?.unsubscribe();
  }
}
