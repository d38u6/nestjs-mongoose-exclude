import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import {
  defaultTransformOptions,
  SanitizeMongooseModelInterceptor,
} from '../interceptors/sanitize-mongoose-model.interceptor';
import { storage } from '../storage';
import { Transformer } from '../Transformer';
jest.mock('../Transformer');

const context = {} as ExecutionContext;

const exampleData = { data: 'data', x: 'y' };

const callHandler = {
  handle: () => of(exampleData),
} as CallHandler;

describe('SanitizeMongooseModelInterceptor', () => {
  let interceptor: SanitizeMongooseModelInterceptor;
  beforeEach(() => {
    interceptor = new SanitizeMongooseModelInterceptor();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should return an observable and pass to them the data', (done) => {
    Transformer.prototype.transform = jest.fn().mockReturnValue(exampleData);
    interceptor.intercept(context, callHandler).subscribe((value) => {
      expect(value).toStrictEqual(exampleData);
      done();
    });
  });

  it('should create the Transformer with a storage and default options', (done) => {
    interceptor.intercept(context, callHandler).subscribe(() => {
      expect(Transformer).toBeCalledWith(storage, defaultTransformOptions);
      done();
    });
  });

  it('should call a transform function form the transformer with the data', (done) => {
    interceptor.intercept(context, callHandler).subscribe(() => {
      const instance: Transformer = (Transformer as jest.Mock).mock.instances[0];
      expect(instance.transform).toBeCalledWith(exampleData);
      done();
    });
  });

  it('should return an observable and pass to them the transformed data', (done) => {
    const transformedData = { ...exampleData, transformer: 'dsa' };
    Transformer.prototype.transform = jest.fn().mockReturnValue(transformedData);
    interceptor.intercept(context, callHandler).subscribe((value) => {
      expect(value).toStrictEqual(transformedData);
      done();
    });
  });
});
