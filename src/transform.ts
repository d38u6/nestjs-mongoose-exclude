import { DeepPartial } from './interfaces/deep-partial.type';
import { TransformOptions } from './interfaces/transform-options.interface';
import { storage } from './storage';
import { defaultTransformOptions, Transformer } from './Transformer';

export function transform<T>(
  obj: T,
  transformOptions: TransformOptions = defaultTransformOptions,
): DeepPartial<T> {
  const transformer = new Transformer(storage, transformOptions);
  return transformer.transform(obj);
}
