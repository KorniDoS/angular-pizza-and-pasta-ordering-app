import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleSidenavService {

  toggled = new BehaviorSubject<boolean>(false);

  constructor(){}

  
}
