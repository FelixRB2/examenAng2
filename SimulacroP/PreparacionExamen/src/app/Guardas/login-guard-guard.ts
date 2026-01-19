import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuardGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  let isAuth: boolean = false;

  if (localStorage.getItem('accesToken')){
    isAuth = true;
  }
  else{
    router.navigate(['/page404']);
  }
  return isAuth;
};
