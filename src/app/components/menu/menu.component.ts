import { Pizza } from './../../models/pizza.model';
import {
  AbstractControl,
  FormBuilder,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import { DialogComponent } from './../dialog/dialog.component';
import { MenuService } from './../../services/menu.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  combineLatest,
  forkJoin,
  map,
  mergeMap,
  of,
  share,
  shareReplay,
  Subscription,
  switchMap,
} from 'rxjs';
import { Pasta } from 'src/app/models/pasta.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  menuItems: any[] = [];
  pizzaItems: Pizza[] = [];
  pastaItems: Pasta[] = [];

  wizardMode?: boolean = false;
  pizzaPastaSub$!: Subscription;
  //secondStep: AbstractControlLike;
  constructor(
    private menuService: MenuService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.pizzaPastaSub$ = this.menuService._pizzaSubject$
      .pipe(
        switchMap((pizza: any) => {
          return combineLatest(of(pizza), this.menuService._pastaSubject$);
        }),
        shareReplay(),
        map(([pizza, pasta]) => {
          return [pizza, pasta];
        })
      )
      .subscribe((res) => {
        this.pizzaItems = res[0];
        this.pastaItems = res[1];

        console.log('New pasta items!');
        console.log('New pizza items!');
      });
  }

  newItemType?: string;
  newToppingsArr: string[] = [];
  newToppingsArrPasta: string[] = [];
  pizzaColumns: string[] = ['position', 'image', 'name', 'toppings', 'price'];
  pastaColumns: string[] = [
    'position',
    'image',
    'name',
    'ingredients',
    'price',
  ];
  //dataSource?: any;

  @ViewChild('pizzaTable') pizzaTable!: MatTable<any>;
  @ViewChild('pastaTable') pastaTable!: MatTable<any>;

  createNew() {
    this.wizardMode = !this.wizardMode;
  }

  removeData() {}

  onSelectItem(item: Pizza | Pasta, id: number) {
    console.log(item);
    let dialogRef = this.dialog
      .open(DialogComponent, {
        minHeight: '500px',
        maxHeight: '650px',
        width: '80vw',
        maxWidth: '600px',
        data: { item: item, id: id },
      })
      .afterClosed()
      .subscribe((ok) => {
        this.pizzaTable.renderRows();
        this.pastaTable.renderRows();
        console.log('Rendered rows!');
      });

    console.log(dialogRef);
  }

  ngOnDestroy(): void {
    this.pizzaPastaSub$.unsubscribe();
  }
}
