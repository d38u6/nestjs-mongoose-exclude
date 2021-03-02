import { ExcludeMetadata } from './interfaces/exclude-metadata.interfaces';

export class MetadataSotrage {
  private excludeProperties = new Map<string, Map<string | symbol, ExcludeMetadata>>();

  addExcludeProperty(modelName: string, propertyName: string | symbol): void {
    if (!this.excludeProperties.has(modelName)) {
      this.excludeProperties.set(modelName, new Map<string, ExcludeMetadata>());
    }
    this.excludeProperties.get(modelName)?.set(propertyName, { modelName, propertyName });
  }

  getExcludeProperties(modelName: string): Map<string | symbol, ExcludeMetadata> | undefined {
    return this.excludeProperties.get(modelName);
  }
}
