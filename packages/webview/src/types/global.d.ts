import MyContainer from '../common/MyContainer';

declare global {
  namespace NodeJS {
    interface Global {
      MyContainer: MyContainer;
    }
  }
}
