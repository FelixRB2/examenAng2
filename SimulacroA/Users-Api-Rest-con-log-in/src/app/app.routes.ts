import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';
import { FormularioComponent } from './pages/formulario/formulario.component';
import { VerMasComponent } from './pages/ver-mas/ver-mas.component';
import { LogIn } from './pages/log-in/log-in';
import { LandingPage } from './pages/landing-page/landing-page';
import { loginGuard, publicGuard } from './guards/login-guard';

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'login', component: LogIn, canActivate: [publicGuard]},
  {path: 'home', component: LandingPage, canActivate: [loginGuard], children:
    [
        {path: 'usuarios', component: UserListComponent},
    {path: 'formulario', component: FormularioComponent},
    {path: 'user/:_id', component: VerMasComponent},
    {path: 'formulario/:_id', component: FormularioComponent},
    ]
  },

  {path: '**', redirectTo: 'home'}
];
