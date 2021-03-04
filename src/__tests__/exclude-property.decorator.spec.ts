import { MetadataSotrage } from '../MetadataSotrage';
import { ExcludeProperty } from '../decorators/exclude-property.decorator';
import { storage } from '../storage';
jest.mock('../MetadataSotrage');

describe('ExcludePropertyDecorator', () => {
  let testObject: Record<string, unknown>;
  let addExcludePropertySpy: jest.SpyInstance<
    void,
    [modleName: string, propertyName: string | symbol]
  >;

  beforeEach(() => {
    testObject = {
      property: 1,
      regularProp: 2,
      exlcudeProp: 'exclude',
    };
    addExcludePropertySpy = jest.spyOn(storage, 'addExcludeProperty');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the metadata storage', () => {
    ExcludeProperty()(testObject, 'a');
    expect(MetadataSotrage).toHaveBeenCalled();
  });

  describe('should add an excluded property to the metadata storage', () => {
    it('with correctly a property name', () => {
      const propertyName = 'exlcudeProp';
      ExcludeProperty()(testObject, propertyName);
      expect(addExcludePropertySpy.mock.calls[0][1]).toBe(propertyName);
    });

    it('with correctly a default model name', () => {
      ExcludeProperty()(testObject, 'doesntMatter');
      expect(addExcludePropertySpy.mock.calls[0][0]).toBe('Object');
    });

    it('with correctly a specified model name', () => {
      const modelName = 'MyModel';
      ExcludeProperty(modelName)(testObject, 'doesntMatter');
      expect(addExcludePropertySpy.mock.calls[0][0]).toBe(modelName);
    });
  });

  describe("shouldn't add an excluded property to the metadata storage", () => {
    it('when a property name is not specified', () => {
      ExcludeProperty()(testObject, '');
      expect(addExcludePropertySpy).not.toHaveBeenCalled();
    });
  });
});
