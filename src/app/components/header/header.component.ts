import { DeliveryService } from './../../services/delivery.service';
import { ToggleSidenavService } from './toggle-sidenav.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private toggleSidenavService: ToggleSidenavService, private deliveryService: DeliveryService) { }
  
  ngOnInit(): void {
    this.deliveryService.getWeather().subscribe(
      (res: any)=>{
        let currentTimeGMT = res["current_weather"]["time"];
        let actualCurrentTime = res["hourly"]["time"].indexOf(currentTimeGMT) + 3;
        let actualTemp = res["hourly"]["temperature_2m"][actualCurrentTime];
        let precipitation = res["hourly"]["precipitation"][actualCurrentTime];
        console.log(actualCurrentTime);
        console.log(actualTemp);
        console.log(precipitation);
        console.log(res['current_weather']);

        this.ETA = this.deliveryService.returnDeliveryETA(actualTemp, precipitation);
      }
    )
  }
  ETA?: number;
  isToggled = false;
  
  onToggle(){
    this.isToggled = !this.isToggled
   this.toggleSidenavService.toggled.next(this.isToggled);
  }
}
