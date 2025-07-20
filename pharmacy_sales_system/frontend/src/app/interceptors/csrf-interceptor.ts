import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const CsrfInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const token = getCookie('csrftoken');
  const methodsToInclude = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (token && methodsToInclude.includes(req.method) && !req.headers.has('X-CSRFToken')) {
    req = req.clone({
      setHeaders: {
        'X-CSRFToken': token
      },
      withCredentials: true
    });
  }

  return next(req);
};
