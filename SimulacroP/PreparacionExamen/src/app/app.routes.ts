import { Routes } from '@angular/router';
import { Pagina404 } from './Pages/pagina404/pagina404';
import { HomePage } from './Pages/home-page/home-page';
import { LoginPage } from './Pages/login-page/login-page';
import { ProductsPage } from './Pages/products-page/products-page';
import { UserPage } from './Pages/user-page/user-page';
import { loginGuardGuard } from './Guardas/login-guard-guard';

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'home'},
    {path: 'home', component: HomePage},
    {path: 'login', component: LoginPage},
    {path: 'products', component: ProductsPage, canActivate : [loginGuardGuard]},
    {path: 'user', component: UserPage, canActivate : [loginGuardGuard]},
    {path: 'page404', component: Pagina404},

    {path: '**', component: Pagina404}
];
