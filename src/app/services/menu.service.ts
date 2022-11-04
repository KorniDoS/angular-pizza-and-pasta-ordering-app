import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Pasta } from 'src/app/models/pasta.model';
import { Pizza } from './../models/pizza.model';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  exhaustMap,
  map,
  Observable,
  Subject,
  toArray,
} from 'rxjs';
import { Injectable } from '@angular/core';
import { concat } from 'rxjs';
import { concatMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MenuService {
  backendApi: string = environment.backendAPIbaseUrl;

  private menu: any[] = [];

  public _menuSubject$ = new BehaviorSubject<any[]>(this.menu);
  public _pizzaSubject$ = new BehaviorSubject<Pizza[]>([]);
  public _pastaSubject$ = new BehaviorSubject<Pasta[]>([]);

  public newItems = new BehaviorSubject<null>(null);
  public newItems$ = this.newItems.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    //   this.authService.user.pipe(
    //        exhaustMap(user=> this.init())
    //    ).subscribe(res=>{
    //       console.log(res);
    //    })
    // this.init().subscribe(
    //    res=>{
    //    this.menu = res;
    //this._menuSubject$.next(this.menu);
    //  this._pizzaSubject$.next(this.menu[0].pizza);
    // this._pastaSubject$.next(this.menu[1].pasta);
    //console.log(this.menu);
    // }
    // )
  }

  init() {
    //  return this.http.get<any[]>('assets/data/menu.json');
    const globalItems: Observable<any> = this.http.get(
      this.backendApi + '/pizza'
    );
    const globalPasta: Observable<any> = this.http.get(
      this.backendApi + '/pasta'
    );

    // const menuObs = concat(globalItems, globalPasta).pipe(toArray());
    //  return menuObs;
  }

  getAdminPizzas(): Observable<any> {
    return this.http.get(this.backendApi + '/pizza');
    //return this.menu.slice();
  }

  getAdminPastas(): Observable<any> {
    return this.http.get(this.backendApi + '/pasta');
  }

  getPizzaMenu(): Observable<any> {
    return this.http.get(this.backendApi + '/pizza/user');
    //return this.menu[0].pizza.slice();
  }

  getPastaMenu(): Observable<any> {
    return this.http.get(this.backendApi + '/pasta/user');
    // return this.menu[1].pasta.slice();
  }

  updatePizzaItem(id: number, changes: Pizza) {
    const { size, crust, toppings } = changes;
    return this.http.patch(this.backendApi + '/pizza/' + id, {
      size: size?.toUpperCase(),
      crustType: crust?.toUpperCase(),
      toppings: toppings,
    });
  }

  updatePastaItem(id: number, changes: Pasta) {
    const { toppings, description } = changes;

    return this.http.patch(this.backendApi + '/pasta/' + id, {
      toppings: toppings,
      description: description,
    });
  }

  addPizzaItem(item: Pizza | any) {
    const { name, description, image, crust, size, price, toppings } = item;
    return this.http.post(this.backendApi + '/pizza', {
      name: name,
      description: description,
      image: image,
      crustType: crust.toUpperCase(),
      size: size.toUpperCase(),
      price: price,
      toppings: toppings,
    });
    // this.menu[0].pizza.push(item);
    //this._menuSubject$.next(this.menu);
    //this._pizzaSubject$.next(this.menu[0].pizza);
  }

  deletePizzaItem(id: number) {
    this.menu[0].pizza.splice(id, 1);
  }

  // updatePizzaItem(id: number, changes: Pizza){
  //     this.menu[0].pizza[id] = changes;
  //     this._pizzaSubject$.next(this.menu[0].pizza);
  //     this._menuSubject$.next(this.menu);
  //     console.log(this.menu[0].pizza);
  // }

  addPastaItem(item: Pasta | any) {
    const { name, description, image, price, toppings } = item;
    return this.http.post(this.backendApi + '/pasta', {
      name: name,
      description: description,
      image: image,
      price: price,
      toppings: toppings,
    });
    // this.menu[1].pasta.push(item);
    // this._menuSubject$.next(this.menu);
    // this._pastaSubject$.next(this.menu[1].pasta);
  }

  deletePastaItem(id: number) {
    this.menu[1].pasta.splice(id, 1);
  }

  // updatePastaItem(id: number, changes: Pasta | any){
  //    this.menu[1].pasta[id] = changes;
  //    this._pastaSubject$.next(this.menu[1].pasta);
  //    this._menuSubject$.next(this.menu);
  //    console.log(this.menu[1].pasta);
  // }

  getPizzaById(id: string){
    return this.http.get(this.backendApi + '/pizza/' + id);
  }

  getPastaById(id: string){
    return this.http.get(this.backendApi + '/pasta/' + id);
  }
}
