import { ToggleSidenavService } from './toggle-sidenav.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private toggleSidenavService: ToggleSidenavService) { }
  
  ngOnInit(): void {
  }
  isToggled = false;
  
  onToggle(){
    this.isToggled = !this.isToggled
   this.toggleSidenavService.toggled.next(this.isToggled);
  }
}
