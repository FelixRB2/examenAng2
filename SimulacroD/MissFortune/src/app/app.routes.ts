import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Productlist } from './pages/productlist/productlist';
import { Userlist } from './pages/userlist/userlist';
import { loginGuardGuard } from './guards/login-guard-guard';

export const routes: Routes = [

  // Cuando se accede a la raíz (/), redirige al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Ruta pública: pantalla de login
  { path: 'login', component: Login },

  // Grupo de rutas protegidas por el guard
  {
    path: '',
    canActivate: [loginGuardGuard], // se ejecuta antes de cualquier hijo
    children: [

      // /home → solo accesible si está autenticado
      { path: 'home', component: Home },

      // /products → solo accesible si está autenticado
      { path: 'products', component: Productlist },

      // /users → solo accesible si está autenticado
      { path: 'users', component: Userlist },
    ]
  },

  // Cualquier ruta no definida redirige al login
  { path: '**', redirectTo: 'login' }
];
