import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Iproduct } from '../interfaces/iproduct';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  httpClient = inject(HttpClient);
  private baseUri: string = ' https://api.escuelajs.co/api/v1/products';

  constructor() {}

  async getAll(): Promise<Iproduct[]>{
    return lastValueFrom(this.httpClient.get<Iproduct[]>(this.baseUri))
  }

  deleteByID(id: number): Promise<boolean> {
    return lastValueFrom(this.httpClient.delete<boolean>(this.baseUri + '/' + id))
  }
}
