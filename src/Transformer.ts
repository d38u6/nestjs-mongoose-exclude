import { DeepPartial } from './interfaces/deep-partial.type';
import { TransformOptions } from './interfaces/transform-options.interface';
import { MetadataSotrage } from './MetadataSotrage';
import { storage } from './storage';
import { getMongooseModelName } from './utilities';

export const defaultTransformOptions = {
  excludeMongooseId: true,
  excludeMongooseV: true,
};

export class Transformer {
  constructor(
    private readonly storage: MetadataSotrage,
    private readonly options: TransformOptions,
  ) {}

  private excludeProperties<T extends Record<string, any>>(
    value: T,
    modelName: string,
  ): DeepPartial<T> {
    const { excludeMongooseId, excludeMongooseV } = this.options;
    if (typeof value?.toJSON === 'function') {
      const JSONmodel = value.toJSON();
      const excludedProperties = this.storage.getExcludeProperties(modelName);
      excludedProperties?.forEach((v) => {
        delete JSONmodel[v.propertyName];
      });
      if (excludeMongooseId) {
        delete JSONmodel._id;
      }
      if (excludeMongooseV) {
        delete JSONmodel.__v;
      }
      return JSONmodel;
    }
    return value;
  }

  transform<T>(value: T): DeepPartial<T> {
    if (
      value === null ||
      value === undefined ||
      value instanceof Date ||
      value instanceof String ||
      value instanceof Number ||
      value instanceof Boolean
    ) {
      return value;
    }

    const modelName = getMongooseModelName(value);
    if (modelName) {
      return this.excludeProperties(value, modelName);
    }

    if (Array.isArray(value)) {
      const newArray: DeepPartial<T> & any[] = [];
      value.forEach((v) => {
        newArray.push(this.transform(v));
      });
      return newArray;
    }

    if (value !== null && typeof value === 'object') {
      const newValue: DeepPartial<T> = {};
      Object.entries(value).forEach(([k, v]) => {
        const key = k as keyof typeof value;
        newValue[key] = this.transform(v);
      });

      return newValue;
    }

    return value;
  }
}
