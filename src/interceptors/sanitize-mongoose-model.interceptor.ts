import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransformOptions } from '../interfaces/transform-options.interface';
import { storage } from '../storage';
import { Transformer } from '../Transformer';

@Injectable()
export class SanitizeMongooseModelInterceptor implements NestInterceptor {
  constructor(
    private transformOptions: TransformOptions = {
      excludeMongooseId: true,
      excludeMongooseV: true,
    },
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const transformer = new Transformer(storage, this.transformOptions);
        const transformedData = transformer.transform(data);
        return transformedData;
      }),
    );
  }
}
