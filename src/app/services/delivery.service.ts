import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(private http: HttpClient) { }

  weatherAPIurl = environment.weatherAPIurl;

  getWeather(){
  return this.http.get(this.weatherAPIurl);
  }

  returnDeliveryETA(temp: number, rain: number): number{

    let ETA  = 0;
    let isCold = false;
    let isRaining = false;

   if(temp < 0 || temp <= 19.9){
    isCold = true;
    if(rain >= 0.1){
      isRaining = true;
      ETA = 60;
      console.log('1. ETA IS: ', ETA);
    }

    if(rain == 0){
      isRaining = false;
      ETA = 45;
      console.log('2. ETA IS: ', ETA);
    }

   } else if (temp >= 20){
    isCold = false;

    if(rain >= 0.1){
      isRaining = true;
      ETA = 35;
      console.log('3. ETA IS: ', ETA)
    }

    if(rain === 0){
      isRaining = false;
      ETA = 25;
      console.log('4. ETA IS: ', ETA)
    }
   }

   return ETA;


    
  }
}
