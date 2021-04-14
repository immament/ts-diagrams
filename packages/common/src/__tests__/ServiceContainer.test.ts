import {ServiceContainer} from '../ServiceContainer';

describe('ServiceContainer', () => {
  test('should return name', () => {
    const container = new ServiceContainer('test');
    expect(container.getName()).toBe('test');
  });

  test('should return registered service', () => {
    const container = new ServiceContainer('test');

    const service = {};
    container.set('key', service);

    expect(container.get('key')).toBe(service);
    expect(container.get('notExistsKey')).toBeUndefined();
    expect(container.getOrThrow('key')).toBe(service);
  });

  test('should getOrThrow throw error if service not exists', () => {
    const container = new ServiceContainer('test');

    expect(() => container.getOrThrow('key')).toThrowError();
  });

  test('should wait for registered service', done => {
    const container = new ServiceContainer('test');

    const service = {};
    container.wait('key-w').then(value => {
      expect(value).toBe(service);
      done();
    });

    container.set('key-w', service);
    container.set('key-w', {});
  });

  test('should wait return service if already registered', done => {
    const container = new ServiceContainer('test');

    const service = {};
    container.set('key-w', service);

    container.wait('key-w').then(value => {
      expect(value).toBe(service);
      done();
    });
  });
});
