import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { SnackbarService } from './services/snackbar.service';
import { Pizza } from './models/pizza.model';
import { Subscription } from 'rxjs';
import { MenuService } from './services/menu.service';
import { CartService } from './services/cart.service';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { ToggleSidenavService } from './components/header/toggle-sidenav.service';
import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { sanitizeIdentifier } from '@angular/compiler';
import { Pasta } from './models/pasta.model';
import { environment } from 'src/environments/environment';

const SMALL_WIDTH_BREAKPOINT = 45; //45em = 700px
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  cartServiceSub$!: Subscription;
  breakpointObs$!: Subscription;
  sideNavSub$!: Subscription;

  showSidenav!: boolean;
  isSmall?: boolean;
  cart: Pizza[] | Pasta[] = [];
  initialLoad: boolean = true;
  initialLoadCounter: number = 0;

  navigationLinks: { link: string; icon: string }[] = [
    { link: 'home', icon: 'home' },
    { link: 'menu', icon: 'book' },
    { link: 'cart', icon: 'shopping_cart' },
    { link: 'contact', icon: 'contacts' },
    {link: 'login', icon: 'person'},
    {link: 'logout', icon: 'highlight_off'}

  ];
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    private toggleSidenavService: ToggleSidenavService,
    private cartService: CartService,
    private menuService: MenuService,
    private breakpointObs: BreakpointObserver,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.authService.autoLogin();
  //   this.cartService.getCart().subscribe((res: any)=>{
  //    this.cart = res.products;
  //    console.log(this.cart);
  //  })
   this.cartServiceSub$ = this.cartService._cartSubject$.subscribe(
    (cartItems) => {
      this.cart = cartItems;
      console.log(this.cart);
    }
  );
    this.sideNavSub$ = this.toggleSidenavService.toggled.subscribe((res) => {
      this.showSidenav = res;
      console.log(res);
    });

    this.menuService._menuSubject$.subscribe((res) => {
      console.log(res);
    });

    this.breakpointObs$ = this.breakpointObs
      .observe([`(max-width: ${SMALL_WIDTH_BREAKPOINT}em)`])
      .subscribe((state: BreakpointState) => {
        console.log(state);
        this.isSmall = state.matches;

        if (!state.matches) {
          this.showSidenav = true;
          this.toggleSidenavService.toggled.next(this.showSidenav);
        } else {
          this.showSidenav = false;
          this.toggleSidenavService.toggled.next(this.showSidenav);
        }
      });
  }
  ngOnDestroy(): void {
    this.breakpointObs$.unsubscribe();
    this.cartServiceSub$.unsubscribe();
    this.sideNavSub$.unsubscribe();
  }

  onLogout(){
    this.authService.logout();
    this.cartService._cartSubject$.next([]);
  }
}
