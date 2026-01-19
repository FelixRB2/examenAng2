import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Iusuario } from '../interfaces/iusuario';
import { Ilogin } from '../interfaces/ilogin';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
   private httpClient = inject(HttpClient);
    private baseUrl: string = 'https://dummyjson.com/auth/';

    constructor() { }

    login(user: Ilogin): Promise<any> {
        return lastValueFrom(this.httpClient.post<any>(this.baseUrl + "login", user));
    }
}
