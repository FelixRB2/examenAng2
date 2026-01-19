import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUsuario } from '../Interfaces/iusuario';
import { lastValueFrom } from 'rxjs';
import { IUsuarioRegistrado } from '../Interfaces/iusuario-registrado';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  
  private httpClient = inject(HttpClient);
  private baseUrl: string = 'https://dummyjson.com/auth/';

  constructor(){}

  login(user :IUsuario): Promise<any> {
    return lastValueFrom(this.httpClient.post<any>(this.baseUrl + "login", user));
    
  }

  getStoredUser(): IUsuarioRegistrado | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) as IUsuarioRegistrado : null;
  }
}
