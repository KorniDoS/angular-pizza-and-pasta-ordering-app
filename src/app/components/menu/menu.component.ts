import { Pizza } from './../../models/pizza.model';
import { FormBuilder } from '@angular/forms';
import { DialogComponent } from './../dialog/dialog.component';
import { MenuService } from './../../services/menu.service';
import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import {
  combineLatest,
  map,
  of,
  shareReplay,
  Subscription,
  switchMap,
} from 'rxjs';
import { Pasta } from 'src/app/models/pasta.model';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {
  menuItems: any[] = [];
  pizzaItems: Pizza[] = [];
  pastaItems: Pasta[] = [];

  wizardMode?: boolean = false;
  pizzaPastaSub$!: Subscription;

  pizzaItemsDataSource = new MatTableDataSource<Pizza>();
  pastaItemsDataSource = new MatTableDataSource<Pasta>();

  @ViewChild('pizzaPaginator')
  pizzaPaginator!: MatPaginator;
  @ViewChild('pastaPaginator')
  pastaPaginator!: MatPaginator;

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

        this.pizzaItemsDataSource.data = this.pizzaItems;
        this.pastaItemsDataSource.data = this.pastaItems;
      });
  }

  createNew() {
    this.wizardMode = !this.wizardMode;
  }
  ngAfterViewInit(): void {
    this.pizzaItemsDataSource.paginator = this.pizzaPaginator;
    this.pastaItemsDataSource.paginator = this.pastaPaginator;
  }

  onSelectItem(item: Pizza | Pasta, id: number) {
    console.log(item);
    let dialogRef = this.dialog.open(DialogComponent, {
      minHeight: '500px',
      maxHeight: '650px',
      width: '80vw',
      maxWidth: '600px',
      data: { item: item, id: id },
    });

    console.log(dialogRef);
  }

  ngOnDestroy(): void {
    this.pizzaPastaSub$.unsubscribe();
  }

  onWizardDone(event: boolean){
    this.wizardMode = false;
  }
}
