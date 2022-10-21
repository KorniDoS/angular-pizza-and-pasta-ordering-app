import {
  AbstractControl,
  FormBuilder,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import { DialogComponent } from './../dialog/dialog.component';
import { MenuService } from './../../services/menu.service';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  menuItems: any[] = [];
  pizzaItems: any[] = [];
  pastaItems: any[] = [];

  wizardMode?: boolean = false;
  //secondStep: AbstractControlLike;
  constructor(
    private menuService: MenuService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.menuService._pizzaSubject$
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

  newItemType?: any;
  newToppingsArr: any[] = [];
  newToppingsArrPasta: any[] = [];
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

  onSelectItem(item: any, id: number) {
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
}