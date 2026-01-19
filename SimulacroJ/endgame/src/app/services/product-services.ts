import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IApi } from '../interfaces/iapi';
import { IProduct } from '../interfaces/iproduct';

@Injectable({
  providedIn: 'root',
})
export class ProductServices {

  private baseUrl = 'https://api.escuelajs.co/api/v1/products';
  private httpClient = inject(HttpClient);

  async getAllProducts(page: number = 1, limit: number = 12): Promise<IProduct[]> {
    const offset = (page - 1) * limit;
    const response = await lastValueFrom(
      this.httpClient.get<IProduct[]>(`${this.baseUrl}?limit=${limit}&offset=${offset}`)
    );
    return response;
  }

  async deleteProductById(productId: number): Promise<void> {
    await lastValueFrom(this.httpClient.delete<void>(`${this.baseUrl}/${productId}`));
  }
}
