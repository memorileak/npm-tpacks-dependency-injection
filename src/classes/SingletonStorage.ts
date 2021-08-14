import {Constructor} from '../types/Constructor';

export class SingletonStorage {
  private static instance: SingletonStorage | null = null;
  private storage: Map<any, Map<any, any>>;

  static getInstance(): SingletonStorage {
    SingletonStorage.instance = SingletonStorage.instance
      || new SingletonStorage();
    return SingletonStorage.instance;
  }

  private constructor() {
    this.storage = new Map();
  }

  getSingletonInstance(
    singletonSpace: any, 
    SingletonClass: Constructor<any>, 
    constructorArguments: Array<any>,
  ): any {
    if (!this.isInstanceCreatedInSpaceWithClass(singletonSpace, SingletonClass)) {
      this.makeSingletonInstance(singletonSpace, SingletonClass, constructorArguments);
    }
    return (<Map<any, any>>(this.storage.get(singletonSpace))).get(SingletonClass);
  }

  private isInstanceCreatedInSpaceWithClass(
    singletonSpace: any, 
    SingletonClass: Constructor<any>,
  ): boolean {
    return this.storage.has(singletonSpace) 
      && (<Map<any, any>>(this.storage.get(singletonSpace))).has(SingletonClass);
  }

  private makeSingletonInstance(
    singletonSpace: any, 
    SingletonClass: Constructor<any>, 
    constructorArguments: Array<any>,
  ): void {
    this.createSingletonSpaceIfItDoesNotExist(singletonSpace);
    this.createSingletonInstanceInsideSingletonSpace(singletonSpace, SingletonClass, constructorArguments);
  }

  private createSingletonSpaceIfItDoesNotExist(singletonSpace: any): void {
    if (!this.storage.has(singletonSpace)) {
      this.storage.set(singletonSpace, new Map());
    }
  }

  private createSingletonInstanceInsideSingletonSpace(
    singletonSpace: any, 
    SingletonClass: Constructor<any>, 
    constructorArguments: Array<any>,
  ): void {
    const singletonInstance = new SingletonClass(...constructorArguments);
    (<Map<any, any>>(this.storage.get(singletonSpace))).set(SingletonClass, singletonInstance);
  }
}
