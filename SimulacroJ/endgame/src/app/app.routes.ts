import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { LogIn } from './pages/log-in/log-in';
import { ProductList } from './pages/product-list/product-list';
import { UsersList } from './pages/users-list/users-list';
import { logInGuard } from './guards/log-in-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LogIn },
  {
    path:'', canActivate: [logInGuard], children: [
      { path: 'home', component: Home},
      { path: 'products', component: ProductList},
      { path: 'users', component: UsersList},
    ]
  },

  { path: '**', redirectTo: 'login' },
];
