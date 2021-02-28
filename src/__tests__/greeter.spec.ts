import { greeter } from 'src/index';

test('My Greeter', () => {
  expect(greeter('Carl')).toBe('Hello Carl');
});
