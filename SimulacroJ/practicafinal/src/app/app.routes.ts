import { Routes} from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { loginGuard } from './guards/login-guard';
import { EmployeesList } from './pages/employees-list/employees-list';
import { EmployeeForm } from './pages/employee-form/employee-form';
import { EmployeeView } from './pages/employee-view/employee-view';
import { adminGuard } from './guards/admin-guard';
import { ProductsList } from './pages/products-list/products-list';

export const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'login', component: Login},
  {path: '', canActivate: [loginGuard], children:
    [
    {path:'home', component: Home},
    {path:'employees', component: EmployeesList},
    {path:'employee-form', component: EmployeeForm},
    {path:'employee-form/:_id', component: EmployeeForm, canActivate:[adminGuard]},
    {path:'employee-view/:_id', component: EmployeeView, canActivate:[adminGuard]},
    {path:'products', component: ProductsList}
    //podria hacer lo mismo con el form y view de los productos con la misma guarda de admin
    ]
  },
  {path:'**', redirectTo:'login'}
];
