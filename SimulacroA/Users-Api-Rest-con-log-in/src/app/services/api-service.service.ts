import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { ApiInterface } from '../interfaces/api-interface.interface';
import { Iuser } from '../interfaces/iuser.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {

  //!!!! MUY IMPORTANTE AÑADIR LA LINEA provideHttpClient() EN APP.CONFIG SINO DA FALLO !!!!!!

    private baseUrl: string = 'https://peticiones.online/api/users';
    httpClient = inject(HttpClient);

    constructor(){}

    //en el get cojo el objeto entero pero luego en el componente tengo que igualarlo a un response.results para solo coger el array de usuarios
    // getAllUsers(): Observable<ApiInterface>{
    //   return this.httpClient.get<ApiInterface>(this.baseUrl);
    // }

    //Este es el get que voy a usar ahora al implementar la paginacion
    getAllUsers(page: number = 1): Promise<ApiInterface>{
      return lastValueFrom(this.httpClient.get<ApiInterface>(`${this.baseUrl}?page=${page}`));
    }

    //get user por id
    getUserById(_id: string): Promise<Iuser>{
      return lastValueFrom(this.httpClient.get<Iuser>(`${this.baseUrl}/${_id}`))
    }

    //delete por id
    deleteById(_id: string): Promise<Iuser>{
      return lastValueFrom(this.httpClient.delete<Iuser>(`${this.baseUrl}/${_id}`))
    }

    //añadir un usuario nuevo
    insertUser(user: Iuser): Promise<Iuser> {
      return lastValueFrom(this.httpClient.post<Iuser>(this.baseUrl, user));
    }

    //actualizar un usuario
    updateUser(user: Iuser): Promise<Iuser> {
      return lastValueFrom(this.httpClient.put<Iuser>(`${this.baseUrl}/${user._id}`, user));
    }


}
