import { MetadataSotrage } from '../MetadataSotrage';

describe('MetadataStorage', () => {
  let storage: MetadataSotrage;
  const mapHasMock = jest.fn();
  const mapSetMock = jest.fn();
  const mapGetMock = jest.fn();
  beforeEach(() => {
    Map.prototype.has = mapHasMock;
    Map.prototype.set = mapSetMock;
    Map.prototype.get = mapGetMock;
    storage = new MetadataSotrage();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(storage).toBeDefined();
  });

  describe('when adding a new excluded property', () => {
    const modelName = 'MyModel';
    const propertyName = 'ExcludedProperty';

    describe('and model not exists inside the storage', () => {
      beforeEach(() => {
        storage.addExcludeProperty(modelName, propertyName);
      });
      it('should call map set function with model name and a new map', () => {
        expect(mapSetMock).toHaveBeenCalledWith(modelName, new Map());
      });
    });

    describe('and model already inside the storage', () => {
      beforeEach(() => {
        mapHasMock.mockReturnValueOnce(true);
        mapGetMock.mockReturnValueOnce(new Map());
        storage.addExcludeProperty(modelName, propertyName);
      });
      it('should call map has function with model name', () => {
        expect(mapHasMock).toHaveBeenCalledWith(modelName);
      });
      it('should call map get function with model name', () => {
        expect(mapGetMock).toHaveBeenCalledWith(modelName);
      });
      it('should call map set function with property name and exclude metadata', () => {
        expect(mapSetMock).toHaveBeenCalledWith(propertyName, { propertyName, modelName });
      });
    });
  });

  describe('when getting excluded properties', () => {
    const modelName = 'MyModel';
    beforeEach(() => {
      storage.getExcludeProperties(modelName);
    });
    it('should call map get function with model name', () => {
      expect(mapGetMock).toHaveBeenCalledWith(modelName);
    });
  });
});
