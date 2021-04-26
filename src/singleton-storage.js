class SingletonStorage {
  constructor() {
    this.storage = new Map();
  }

  getSingletonInstance(singletonSpace, SingletonClass, constructorArguments) {
    if (this.isInstanceCreatedInSpaceWithClass(singletonSpace, SingletonClass)) {
      return this.storage.get(singletonSpace).get(SingletonClass);
    } else {
      return this.makeSingletonInstance(singletonSpace, SingletonClass, constructorArguments);
    }
  }

  isInstanceCreatedInSpaceWithClass(singletonSpace, SingletonClass) {
    return this.storage.has(singletonSpace) && this.storage.get(singletonSpace).has(SingletonClass);
  }

  makeSingletonInstance(singletonSpace, SingletonClass, constructorArguments) {
    this.createSingletonSpaceIfItDoesNotExist(singletonSpace);
    const singletonInstance = new SingletonClass(...constructorArguments);
    this.storage.get(singletonSpace).set(SingletonClass, singletonInstance);
    return singletonInstance;
  }

  createSingletonSpaceIfItDoesNotExist(singletonSpace) {
    if (!this.storage.has(singletonSpace)) {
      this.storage.set(singletonSpace, new Map());
    }
  }
}

const singletonStorage = new SingletonStorage();
module.exports = {singletonStorage};
