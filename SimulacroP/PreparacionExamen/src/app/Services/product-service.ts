import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom, skip } from 'rxjs';
import { IProductoApi } from '../Interfaces/iproducto-api';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  
  private baseUrl: string = 'https://dummyjson.com/products';
  httpClient = inject(HttpClient);

  constructor(){}

  async getAllUsers(): Promise<IProductoApi>{
    return lastValueFrom(this.httpClient.get<any>(this.baseUrl));
  }


}
