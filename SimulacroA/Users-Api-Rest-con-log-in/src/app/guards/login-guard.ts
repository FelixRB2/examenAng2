import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Guard para rutas protegidas (requiere login)
export const loginGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const isAuth = !!localStorage.getItem('accessToken');

    if (!isAuth) {
        router.navigate(['/login']);
        return false;
    }
    return true;
};

// Guard para la página de login (evita acceso si ya está logueado)
export const publicGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const isAuth = !!localStorage.getItem('accessToken');

    if (isAuth) {
        // Si ya está autenticado, redirigir a home
        router.navigate(['/home']);
        return false;
    }
    return true;
};
