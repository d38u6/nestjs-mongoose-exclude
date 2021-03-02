import { storage } from '../storage';

export function ExcludeProperty(modelName?: string): PropertyDecorator {
  return (obj: any, propertyName: string | symbol) => {
    if (obj && propertyName) {
      const target = obj instanceof Function ? obj : obj.constructor;
      storage.addExcludeProperty(modelName || target.name, propertyName);
    }
  };
}
