import { Pizza } from './../../models/pizza.model';
import { FormBuilder } from '@angular/forms';
import { DialogComponent } from './../dialog/dialog.component';
import { MenuService } from './../../services/menu.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  ViewChildren,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import {
  combineLatest,
  concatAll,
  concatMap,
  exhaustMap,
  mergeMap,
  of,
  shareReplay,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { Pasta } from 'src/app/models/pasta.model';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { concat, toArray, Observable } from 'rxjs';
import { merge } from 'rxjs';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs';
import { from } from 'rxjs';
import { WizardComponent } from '../wizard/wizard.component';
import { AuthService } from 'src/app/services/auth.service';
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

  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
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

  combinedPizzaItems: any[] = [];
  combinedPastaItems: any[] = [];
  constructor(
    private menuService: MenuService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    // this.pizzaPastaSub$ = this.menuService._pizzaSubject$
    //   .pipe(
    //     tap(()=>this.spinner.show()),
    //     switchMap((pizza: any) => {
    //       return combineLatest(of(pizza), this.menuService._pastaSubject$);
    //     }),
    //     shareReplay(),
    //     map(([pizza, pasta]) => {
    //       return [pizza, pasta];
    //     })
    //   )
    //   .subscribe((res) => {
    //     this.pizzaItems = res[0];
    //     this.pastaItems = res[1];

    //     this.pizzaItemsDataSource.data = this.pizzaItems;
    //     this.pastaItemsDataSource.data = this.pastaItems;

    //     setTimeout(()=>{
    //     this.spinner.hide();
    //     }, 1000)

    //   });

    const adminPizzas: Observable<any> = this.menuService.getAdminPizzas();
    const adminPastas: Observable<any> = this.menuService.getAdminPastas();
    const pizzaMenu: Observable<any> = this.menuService.getPizzaMenu();
    const pastaMenu: Observable<any> = this.menuService.getPastaMenu();

    let concated: Observable<any>;

    if (this.authService.isAdmin === true) {
      concated = combineLatest([adminPizzas, adminPastas]);
      this.pizzaPastaSub$ = this.menuService.newItems
        .pipe(mergeMap((_newItems) => concated))
        .subscribe((value: any) => {
          console.log('Received new values!');
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);

          this.combinedPizzaItems = [...value[0]];
          this.combinedPastaItems = [...value[1]];

          this.pizzaItemsDataSource.data = this.combinedPizzaItems;
          this.pastaItemsDataSource.data = this.combinedPastaItems;

          console.log(this.combinedPizzaItems);
        });
    } else {
      concated = combineLatest([adminPizzas, adminPastas, pizzaMenu, pastaMenu]);
      this.pizzaPastaSub$ = this.menuService.newItems
        .pipe(mergeMap((_newItems) => concated))
        .subscribe((value: any) => {
          console.log('Received new values!');
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);

          this.combinedPizzaItems = [...value[0], ...value[2]];
          this.combinedPastaItems = [...value[1], ...value[3]];

          this.pizzaItemsDataSource.data = this.combinedPizzaItems;
          this.pastaItemsDataSource.data = this.combinedPastaItems;

          console.log(this.combinedPizzaItems);
        });
    }

    // this.pizzaPastaSub$ = concated.subscribe((value:any)=> {
    // this.combinedPizzaItems= [...value[0], ...value[2]];
    // this.combinedPastaItems = [...value[1], ...value[3]];
    //
    // this.pizzaItemsDataSource.data = this.combinedPizzaItems;
    //  this.pastaItemsDataSource.data = this.combinedPastaItems;
    // console.log(combinedPizzaItems);
    //  }

    // );

    //this.http.get('http://localhost:3000/pizza').subscribe(console.log);
    //this.http.get('http://localhost:3000/pasta').subscribe(console.log);
    //this.http.get('http://localhost:3000/pizza/user').subscribe(console.log);
    //this.http.get('http://localhost:3000/pasta/user').subscribe(console.log);

    //wholeMenu.subscribe(console.log)
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

  onWizardDone(event: boolean) {
    this.wizardMode = false;
    //this.wizardComponent.
  }
}
