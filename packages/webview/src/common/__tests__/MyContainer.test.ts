import {ServiceContainer} from '../ServiceContainer';

describe('ServiceContainer', () => {
  test('should return registered service', () => {
    const container = new ServiceContainer();

    const service = {};
    container.set('key', service);

    expect(container.get('key')).toBe(service);
    expect(container.get('notExistsKey')).toBeUndefined();
    expect(container.getOrThrow('key')).toBe(service);
  });

  test('should getOrThrow throw error if service not exists', () => {
    const container = new ServiceContainer();

    expect(() => container.getOrThrow('key')).toThrowError();
  });
});
