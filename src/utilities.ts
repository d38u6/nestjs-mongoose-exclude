import { Model } from 'mongoose';

export function getMongooseModelName(data: any): string | undefined {
  let modelName: string | undefined = undefined;
  const models = data?.__proto__?.db?.models;

  if (models) {
    Object.entries(models).forEach(([modelKey, model]) => {
      if (data instanceof (model as any)) {
        modelName = modelKey;
      }
    });
  }
  return modelName;
}
