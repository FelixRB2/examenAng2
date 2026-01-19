import { Iapi } from './../interfaces/iapi';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Iusuario } from '../interfaces/iusuario';
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  
    private baseURL: string = 'https://peticiones.online/api/users';
    httpClient = inject(HttpClient);


    constructor(){}


    async getAllUsers(page: number = 1): Promise<Iapi> {  
      const resp = await lastValueFrom(this.httpClient.get<Iapi>(this.baseURL + '?page=' + page)); 
      return resp;
    }


    async eliminarUsuarioID(_id: string): Promise<Iusuario> {  
      return lastValueFrom(this.httpClient.delete<Iusuario>(this.baseURL + '/' + _id)); 
    }


    async getByID(_id: String): Promise<Iusuario>{ 
      return lastValueFrom(this.httpClient.get<Iusuario>(this.baseURL + '/' + _id)); 
    }

    async update(usuario: Iusuario): Promise<Iusuario> {
      return lastValueFrom(
        this.httpClient.put<Iusuario>(this.baseURL + '/' + usuario._id, usuario)
      );
    }

    async create(usuario: Iusuario): Promise<Iusuario> {
      return lastValueFrom(
        this.httpClient.post<Iusuario>(this.baseURL, usuario)
      );
    }

    async delete(_id: string): Promise<Iusuario> {
      return lastValueFrom(
        this.httpClient.delete<Iusuario>(this.baseURL + '/' + _id)
      );
    }
}




























