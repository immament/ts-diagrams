import {ServiceContainer} from '../common/ServiceContainer';

declare global {
  namespace NodeJS {
    interface Global {
      ServiceContainer: ServiceContainer;
    }
  }
}
