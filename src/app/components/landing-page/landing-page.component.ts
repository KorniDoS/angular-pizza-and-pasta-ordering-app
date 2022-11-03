import { Pasta } from './../../models/pasta.model';
import { Pizza } from './../../models/pizza.model';
import { Team } from './../../models/team.model';
import { TeamService } from './../../services/team.service';
import { CartService } from './../../services/cart.service';
import { MenuService } from './../../services/menu.service';
import { ToggleSidenavService } from './../header/toggle-sidenav.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { concatMap, Observable, shareReplay, Subscription } from 'rxjs';
import { concat } from 'rxjs';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit, OnDestroy {
  teamSub$!: Subscription;
  menuSub$!: Subscription;
  cartSub$!: Subscription;

  menu: any[] = [];
  cart: Pizza[] | Pasta[] = [];
  team: Team[] = [];
  obs$!: Observable<any>;
  constructor(
    private menuService: MenuService,
    private cartService: CartService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.teamSub$ = this.teamService.getTeamMembers().subscribe((team) => {
      this.team = team;
    });

   // this.menuSub$ = this.menuService._menuSubject$.subscribe((res) => {
    //  this.menu = res;
    //  console.log(this.menu);
   // });

    this.obs$ = combineLatest([this.menuService.getAdminPastas(), this.menuService.getAdminPizzas()]);

    this.menuSub$ = this.obs$.subscribe(res=>{
      this.menu = res;
      console.log(res);
    })

  }

  ngOnDestroy(): void {
    this.teamSub$.unsubscribe();
    this.menuSub$.unsubscribe();
  }
}
