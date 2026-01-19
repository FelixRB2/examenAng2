import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
      //ng g interceptor interceptors/auth --skip-tests
    //Opcion 3: creamos el interceptor y mete la cabecera en todas las peticiones

    const cloneRequest = req.clone({
        setHeaders: {
            'Content-type': 'aplication/json',
            'Authorization': localStorage.getItem("access_token") || ""
        }
    });

    if (cloneRequest.url.includes("auth")) {
        return next(req);
    }
    else {
        return next(cloneRequest);
    };

};
