import { HttpInterceptorFn } from '@angular/common/http';
import { secrets } from '../../../environments/environment.secret'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = (secrets as any)?.grokApiKey;

  if (!apiKey) {
    console.warn('⚠️ Grok API ключ не знайдено! Створи environment.secrets.ts');
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${apiKey}` }
  });

  return next(authReq);
};
