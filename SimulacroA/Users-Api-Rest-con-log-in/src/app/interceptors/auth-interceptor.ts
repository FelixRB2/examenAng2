import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
      const cloneRequest = req.clone({
        setHeaders: {
            'Content-type': 'aplication/json', //igual falta una p y es application/json
            'Authorization': localStorage.getItem("accessToken") || "" //la unica informacion que deberia cambiar seria en esta linea dependiendo el nombre del token
        }
    });

    if (cloneRequest.url.includes("auth")) { //en esta linea tambien se podria tener que cambiar dependiendo del back
        return next(req);
    }
    else {
        return next(cloneRequest);
    };
};
