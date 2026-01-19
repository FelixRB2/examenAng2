import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IApiEmployees } from '../interfaces/iapi-employees';
import { lastValueFrom } from 'rxjs';
import { Iemployee } from '../interfaces/iemployee';

@Injectable({
  providedIn: 'root',
})
export class EmployeesServices {

  private baseUrl: string = 'https://peticiones.online/api/users';
  private httpClient = inject(HttpClient);

  constructor() { }

  async getAllEmployees(page: number = 1): Promise<IApiEmployees>{
    const response = await lastValueFrom(this.httpClient.get<IApiEmployees>(`${this.baseUrl}?page=${page}`));
    return response;
  };

  async deleteEmployeeById(_id: string): Promise<Iemployee> {
    return lastValueFrom(this.httpClient.delete<Iemployee>(`${this.baseUrl}/${_id}`));
  }

  async getEmployeeById(_id: string): Promise<Iemployee> {
    return lastValueFrom(this.httpClient.get<Iemployee>(this.baseUrl + '/' + _id));
  }

  async createEmployee(employee: Iemployee): Promise<Iemployee> {
    return lastValueFrom(this.httpClient.post<Iemployee>(this.baseUrl, employee));
  }

  async updateEmployee(employee: Iemployee): Promise<Iemployee> {
    return lastValueFrom(this.httpClient.put<Iemployee>(`${this.baseUrl}/${employee._id}`, employee));
  }

  async deleteEmployee(employee: Iemployee): Promise<Iemployee> {
    return lastValueFrom(this.httpClient.delete<Iemployee>(`${this.baseUrl}/${employee._id}`));
  }
}
