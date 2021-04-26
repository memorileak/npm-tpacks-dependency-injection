const {singletonStorage} = require('./singleton-storage.js');
const {Provider} = require('./provider.js');

class Injector {
  constructor(...providerChain) {
    this.providers = providerChain;
  }

  getServiceOfToken(injectionToken) {
    const provider = this.findFirstProviderCanProvideToken(injectionToken);
    if (provider) {
      const {
        useClass: ServiceClass,
        type: serviceType,
        dependencies: dependencyTokens,
      } = provider.getProviderConfigOfToken(injectionToken);
      return this.getServiceInstanceBasedOnServiceType(serviceType, provider, ServiceClass, dependencyTokens);
    } else {
      throw new Error(`Injection token ${injectionToken} is not found in any provider in this injector`);
    }
  }

  findFirstProviderCanProvideToken(injectionToken) {
    return this.providers.find((provider) => provider.isAbleToProvideToken(injectionToken));
  }

  getServiceInstanceBasedOnServiceType(serviceType, provider, ServiceClass, dependencyTokens) {
    if (serviceType === Provider.SERVICE_TYPES.singleton) {
      return this.getSingletonServiceInstance(provider, ServiceClass, dependencyTokens);
    } else {
      return this.makeServiceInstance(ServiceClass, dependencyTokens);
    }
  }

  getSingletonServiceInstance(provider, ServiceClass, dependencyTokens) {
    const dependencyInstances = this.getServicesOfTokens(dependencyTokens);
    return singletonStorage.getSingletonInstance(provider, ServiceClass, dependencyInstances);
  }

  makeServiceInstance(ServiceClass, dependencyTokens) {
    const dependencyInstances = this.getServicesOfTokens(dependencyTokens);
    return new ServiceClass(...dependencyInstances);
  }

  getServicesOfTokens(injectionTokens) {
    return injectionTokens.map((injectionToken) => this.getServiceOfToken(injectionToken));
  }
}

module.exports = {Injector};
