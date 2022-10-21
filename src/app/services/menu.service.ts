import { Pasta } from 'src/app/models/pasta.model';
import { Pizza } from './../models/pizza.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class MenuService { 

    private menu: any[] = [];

    public _menuSubject$ = new BehaviorSubject<any[]>(this.menu);
    public _pizzaSubject$ = new BehaviorSubject<Pizza[]>([]);
    public _pastaSubject$ = new BehaviorSubject<Pasta[]>([]);

    constructor(private http:HttpClient) { 

        this.init().subscribe(
            res=>{
                this.menu = res;
               this._menuSubject$.next(this.menu);
               this._pizzaSubject$.next(this.menu[0].pizza);
               this._pastaSubject$.next(this.menu[1].pasta);
               //console.log(this.menu);
           }
        )
    }

    init(): Observable<any[]>{
        return this.http.get<any[]>('assets/data/menu.json');
    }

    getMenu(){
        return this.menu.slice();
    }

    getPizzaMenu(){
        return this.menu[0].pizza.slice();
    }

    getPastaMenu(){
        return this.menu[1].pasta.slice();
    }


    addPizzaItem(item: Pizza | any){
        this.menu[0].pizza.push(item);
        this._menuSubject$.next(this.menu);
        this._pizzaSubject$.next(this.menu[0].pizza);
    }

    deletePizzaItem(id: number){
        this.menu[0].pizza.splice(id, 1);
    }

    updatePizzaItem(id: number, changes: Pizza){
        this.menu[0].pizza[id] = changes;
        this._pizzaSubject$.next(this.menu[0].pizza);
        this._menuSubject$.next(this.menu);
        console.log(this.menu[0].pizza);
    }

    addPastaItem(item: Pizza | any){
        this.menu[1].pasta.push(item);
        this._menuSubject$.next(this.menu);
        this._pastaSubject$.next(this.menu[1].pasta);
    }

    deletePastaItem(id: number){
        this.menu[1].pasta.splice(id, 1);
    }

    updatePastaItem(id: number, changes: Pasta | any){
        this.menu[1].pasta[id] = changes;
        this._pastaSubject$.next(this.menu[1].pasta);
        this._menuSubject$.next(this.menu);
        console.log(this.menu[1].pasta);
    }


  


    
}