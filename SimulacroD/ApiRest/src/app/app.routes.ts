import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { UserFormComponent } from './pages/user-form/user-form';
import { UserList } from './pages/user-list/user-list';
import { UserView } from './pages/user-view/user-view';
import { Page404 } from './pages/page404/page404';
import { Login } from './pages/login/login';
import { authguardGuard } from './guards/authguard-guard';
import { loginGuard } from './guards/login-guard';
import { unsavedChangesGuard } from './guards/unsaved-changes-guard'; // ← IMPORTA AQUÍ

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login'},
    { path: 'login', component: Login, canActivate: [loginGuard]},
    
    {
        path: '',
        canActivate: [authguardGuard],
        children: [
            { path: 'home', component: Home},
            { 
                path: 'formulario', 
                component: UserFormComponent,
                canDeactivate: [unsavedChangesGuard] 
            },
            { 
                path: 'formulario/:_id', 
                component: UserFormComponent,
                canDeactivate: [unsavedChangesGuard] 
            },
            { path: 'usuarios', component: UserList},
            { path: 'usuarios/:_id', component: UserView},
        ]
    },

    { path: '**', component: Page404 },
];