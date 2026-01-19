import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IApiProducts } from '../interfaces/iapi-products';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsServices {

  private baseUrl: string = 'https://peticiones.online/api/products';
  private httpClient = inject(HttpClient);

  constructor() { }

  async getAllProducts(page: number = 1): Promise<IApiProducts>{
    const response = await lastValueFrom(this.httpClient.get<IApiProducts>(`${this.baseUrl}?page=${page}`));
    return response;
  }

  async getProductById(_id: string): Promise<IApiProducts>{
    return lastValueFrom(this.httpClient.get<IApiProducts>(`${this.baseUrl}/${_id}`));
  }

  async deleteProductById(_id: string): Promise<IApiProducts>{
    return lastValueFrom(this.httpClient.delete<IApiProducts>(this.baseUrl + '/' + _id));
  }
}
