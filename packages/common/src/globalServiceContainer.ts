import {ServiceContainer} from './ServiceContainer';

const serviceContainer =
  window.ServiceContainer ??
  (window.ServiceContainer = new ServiceContainer('global'));

export default serviceContainer;
