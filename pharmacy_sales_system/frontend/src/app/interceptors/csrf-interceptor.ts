import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Csrf } from '../services/csrf';
import { inject, Inject } from '@angular/core';

export const CsrfInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const csrfService = inject(Csrf)
  const token = csrfService.getToken()

//   const token = getCookie('csrftoken');
  const methodsToInclude = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  let modifiedReq = req.clone({
    withCredentials: true  
  });

  if (token && methodsToInclude.includes(req.method) && !req.headers.has('X-CSRFToken')) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        'X-CSRFToken': token
      }
    });
  }

  return next(modifiedReq);
};

// function getCookie(name: string): string | null {
//   const cookies = document.cookie.split(';');
//   for (const cookie of cookies) {
//     const [key, value] = cookie.trim().split('=');
//     if (key === name) {
//       return decodeURIComponent(value);
//     }
//   }
//   return null;
// }
