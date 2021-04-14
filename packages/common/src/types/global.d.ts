import {ServiceContainer} from '../ServiceContainer';

declare global {
  namespace NodeJS {
    interface Global {
      ServiceContainer: ServiceContainer;
    }
  }

  interface Window {
    ServiceContainer: ServiceContainer;
  }
}
