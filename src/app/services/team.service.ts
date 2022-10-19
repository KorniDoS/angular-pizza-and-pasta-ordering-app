import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class TeamService {
    constructor(private http: HttpClient) { }

    getTeamMembers(): Observable<any[]>{
        return this.http.get<any[]>('assets/data/team.json');
    }
    
}