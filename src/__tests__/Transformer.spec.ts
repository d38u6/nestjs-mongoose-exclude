import { Transformer } from '../Transformer';
import { MetadataSotrage } from '../MetadataSotrage';
import { defaultTransformOptions } from '../interceptors/sanitize-mongoose-model.interceptor';

jest.mock('../utilities', () => ({
  getMongooseModelName: ({ model }: any) =>
    model && model === 'MOCK_MODEL' ? 'MOCK_MODEL' : undefined,
}));

const toJSONMock = () => {
  const { toJSON, ...rest } = mockModel;
  return rest;
};
const mockModel = {
  _id: 'mongooseId',
  __v: 'mongooseV',
  model: 'MOCK_MODEL',
  regularProp: 'i am regular',
  propNumberTwo: 'i am always be a second',
  excludedProp: 'exlude me',
  excludedPropTwo: 'and me too',
  toJSON: toJSONMock,
};

const sanitizedModel = {
  model: 'MOCK_MODEL',
  regularProp: 'i am regular',
  propNumberTwo: 'i am always be a second',
};

describe('Transformer', () => {
  let storage: MetadataSotrage;
  let transformer: Transformer;
  const modelName = 'MOCK_MODEL';

  beforeEach(() => {
    storage = new MetadataSotrage();
    storage.addExcludeProperty(modelName, 'excludedProp');
    storage.addExcludeProperty(modelName, 'excludedPropTwo');
    transformer = new Transformer(storage, defaultTransformOptions);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when transform object', () => {
    describe('and the value it is a model', () => {
      it('should exclude all excluded properties', () => {
        expect(transformer.transform(mockModel)).toStrictEqual(sanitizedModel);
      });
      describe('and when exclude mongoose id option is off', () => {
        beforeEach(() => {
          transformer = new Transformer(storage, {
            ...defaultTransformOptions,
            excludeMongooseId: false,
          });
        });
        it('should exclude all excluded properties without _id', () => {
          expect(transformer.transform(mockModel)).toStrictEqual({
            ...sanitizedModel,
            _id: mockModel._id,
          });
        });
      });
      describe('and when exclude mongoose v option is off', () => {
        beforeEach(() => {
          transformer = new Transformer(storage, {
            ...defaultTransformOptions,
            excludeMongooseV: false,
          });
        });
        it('should exclude all excluded properties without __v', () => {
          expect(transformer.transform(mockModel)).toStrictEqual({
            ...sanitizedModel,
            __v: mockModel.__v,
          });
        });
      });
    });

    describe('and the value it is a array of model', () => {
      let arrayOfModels: any[];
      let arrayOfSanitizedModels: any[];
      beforeEach(() => {
        arrayOfModels = new Array(10).fill(mockModel);
        arrayOfSanitizedModels = new Array(10).fill(sanitizedModel);
      });

      it('should sanitize each model from array', () => {
        expect(transformer.transform(arrayOfModels)).toStrictEqual(arrayOfSanitizedModels);
      });
    });

    describe('and the value have nested models', () => {
      describe('and when model is nested on the first level', () => {
        let nestedValue: Record<string, any>;
        let sanitizeNestedValue: Record<string, any>;
        beforeEach(() => {
          nestedValue = { a: 'a', b: 'b', c: 'c', mockModel };
          sanitizeNestedValue = { a: 'a', b: 'b', c: 'c', mockModel: sanitizedModel };
        });

        it('should sanitize nested model from object', () => {
          expect(transformer.transform(nestedValue)).toStrictEqual(sanitizeNestedValue);
        });
      });

      describe('and when model is deep nested', () => {
        let nestedValue: Record<string, any>;
        let sanitizeNestedValue: Record<string, any>;
        beforeEach(() => {
          nestedValue = { a: 'a', b: 'b', c: 'c', d: { e: { f: { g: { h: { mockModel } } } } } };
          sanitizeNestedValue = {
            a: 'a',
            b: 'b',
            c: 'c',
            d: { e: { f: { g: { h: { mockModel: sanitizedModel } } } } },
          };
        });

        it('should sanitize nested model from object', () => {
          expect(transformer.transform(nestedValue)).toStrictEqual(sanitizeNestedValue);
        });
      });
    });
  });
});
