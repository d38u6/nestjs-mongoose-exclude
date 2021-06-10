import { storage } from '../storage';
import { defaultTransformOptions, Transformer } from '../Transformer';
import { transform } from '../transform';
import { TransformOptions } from '../interfaces/transform-options.interface';
jest.mock('../Transformer');

const mockObj = {
  _id: 'mongooseId',
  __v: 'mongooseV',
  model: 'MOCK_MODEL',
  regularProp: 'i am regular',
  propNumberTwo: 'i am always be a second',
  excludedProp: 'exlude me',
  excludedPropTwo: 'and me too',
};

describe('transform function', () => {
  beforeEach(() => {
    transform(mockObj);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the Transformer with a storage and default options', () => {
    transform(mockObj);

    expect(Transformer).toBeCalledWith(storage, defaultTransformOptions);
  });

  it('should create the Transformer with a storage and custom options', () => {
    const options: TransformOptions = { excludeMongooseId: false, excludeMongooseV: false };
    transform(mockObj, options);

    expect(Transformer).toBeCalledWith(storage, options);
  });

  it('should call transform function from the transformer with the data', () => {
    const options: TransformOptions = { excludeMongooseId: false, excludeMongooseV: false };
    transform(mockObj, options);

    const instance: Transformer = (Transformer as jest.Mock).mock.instances[0];

    expect(instance.transform).toBeCalledWith(mockObj);
  });
});
