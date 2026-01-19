import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const logInGuard: CanActivateFn = () => {

  const router = inject(Router);

  let isAuth: boolean = false;
  if(localStorage.getItem('access_token')) {
    isAuth = true;
  } else {
    router.navigate(['/login']);
  }
  return isAuth;
};
