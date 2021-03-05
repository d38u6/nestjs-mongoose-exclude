import { getMongooseModelName } from '../utilities';
import { model, Schema } from 'mongoose';

const modelName = 'TEST_MODEL';

const TestModel = model(modelName, new Schema({}));

describe('utilities', () => {
  describe('getMongooseModelName', () => {
    describe('when object is not a mongoose model', () => {
      it('should return undefined', () => {
        expect(getMongooseModelName({})).toBe(undefined);
      });
    });

    describe('when object is valid mongoose model', () => {
      expect(getMongooseModelName(new TestModel())).toBe(modelName);
    });
  });
});
