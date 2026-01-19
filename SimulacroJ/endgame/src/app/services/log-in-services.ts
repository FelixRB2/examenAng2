import { inject, Injectable } from '@angular/core';
import { Iuser } from '../interfaces/iuser';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LogInServices {
  private baseUrl: string = 'https://api.escuelajs.co/api/v1/auth/login';
  private httpClient = inject(HttpClient);

  constructor() {}

  logIn(logInUser: Iuser): Promise<any> {
    return lastValueFrom(this.httpClient.post<any>(this.baseUrl, logInUser));
  }

}
