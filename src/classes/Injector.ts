import {InjectionToken} from '../types/InjectionToken';

import {SingletonStorage} from './SingletonStorage';
import {Provider} from './Provider';
import {Constructor} from '../types/Constructor';
import {ServiceType} from '../types/ServiceType';

export class Injector {
  private singletonStorage: SingletonStorage;
  private providers: Array<Provider>;

  constructor() {
    this.singletonStorage = SingletonStorage.getInstance();
    this.providers = [];
  }

  withProviders(providers: Array<Provider>): Injector {
    this.providers = providers;
    return this;
  }

  getServiceOfToken(injectionToken: InjectionToken): any {
    const provider = this.findFirstProviderCanProvideToken(injectionToken);
    if (provider) {
      const {useClass, type, dependencies} = provider.getProviderConfigOfToken(injectionToken);
      return this.getServiceInstanceBasedOnServiceType(type, provider, useClass, dependencies);
    } else {
      throw new Error(`Injection token ${injectionToken} is not found in any provider in this injector`);
    }
  }

  findFirstProviderCanProvideToken(injectionToken: InjectionToken): Provider | undefined {
    return this.providers
      .find((provider) => provider.isAbleToProvideToken(injectionToken));
  }

  getServiceInstanceBasedOnServiceType(
    serviceType: ServiceType, 
    provider: Provider, 
    ServiceClass: Constructor<any>, 
    dependencyTokens: Array<InjectionToken>,
  ): any {
    if (serviceType === ServiceType.singleton) {
      return this.getSingletonServiceInstance(provider, ServiceClass, dependencyTokens);
    } else {
      return this.makeServiceInstance(ServiceClass, dependencyTokens);
    }
  }

  getSingletonServiceInstance(
    provider: Provider, 
    ServiceClass: Constructor<any>, 
    dependencyTokens: Array<InjectionToken>,
  ): any {
    const dependencyInstances = this.getServicesOfTokens(dependencyTokens);
    return this.singletonStorage
      .getSingletonInstance(provider, ServiceClass, dependencyInstances);
  }

  private makeServiceInstance(
    ServiceClass: Constructor<any>, 
    dependencyTokens: Array<InjectionToken>,
  ): any {
    const dependencyInstances = this.getServicesOfTokens(dependencyTokens);
    return new ServiceClass(...dependencyInstances);
  }

  getServicesOfTokens(injectionTokens: Array<InjectionToken>): Array<any> {
    return injectionTokens.map((token) => this.getServiceOfToken(token));
  }
}
