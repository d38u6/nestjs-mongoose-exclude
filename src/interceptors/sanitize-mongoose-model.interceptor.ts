import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { storage } from '../storage';
import { getMongooseModelName } from '../utilities';

// 1. Get model name
// 2. Get all excluded properties14
// 3. exlude, excluded properties
// 4. return data

@Injectable()
export class SanitizeMongooseModelInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const name = getMongooseModelName(data);
        console.log(typeof data);
        console.log(typeof data.user);
        if (name) {
          const properties = storage.getExcludeProperties(name);
          console.log('herr');
        }

        return { ok: 'ok' };
      }),
    );
  }
}
