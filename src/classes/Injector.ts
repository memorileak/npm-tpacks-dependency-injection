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

  getServicesOfTokens(injectionTokens: Array<InjectionToken>): Array<any> {
    return injectionTokens.map((token) => this.getServiceOfToken(token));
  }

  getServiceOfToken(injectionToken: InjectionToken): any {
    const provider = this.findFirstProviderCanProvideToken(injectionToken);
    if (provider) {
      const {useClass, type} = provider.getProviderConfigOfToken(injectionToken);
      return this.getServiceInstanceBasedOnServiceType(type, provider, useClass);
    } else {
      throw new Error(`Injection token ${injectionToken} is not found in any provider in this injector`);
    }
  }

  private findFirstProviderCanProvideToken(injectionToken: InjectionToken): Provider | undefined {
    return this.providers
      .find((provider) => provider.isAbleToProvideToken(injectionToken));
  }

  private getServiceInstanceBasedOnServiceType(
    serviceType: ServiceType, 
    provider: Provider, 
    ServiceClass: Constructor<any>, 
  ): any {
    if (serviceType === ServiceType.singleton) {
      return this.getSingletonServiceInstance(provider, ServiceClass);
    } else {
      return this.makeServiceInstance(ServiceClass);
    }
  }

  private getSingletonServiceInstance(provider: Provider, ServiceClass: Constructor<any>): any {
    return this.singletonStorage
      .getSingletonInstance(provider, ServiceClass, []);
  }

  private makeServiceInstance(ServiceClass: Constructor<any>): any {
    return new ServiceClass();
  }
}
