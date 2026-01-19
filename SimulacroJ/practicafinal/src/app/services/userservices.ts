import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Iuser } from '../interfaces/iuser';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Userservices {

  private httpClient = inject(HttpClient);
  private baseUrl = 'https://dummyjson.com/auth/login';

  login(user: Iuser): Promise<any>{
    return lastValueFrom(this.httpClient.post<any>(this.baseUrl, user));
  }
}
