import {Constructor} from '../types/Constructor';
import {ServiceType} from '../types/ServiceType';
import {InjectableConfig} from '../structs/InjectableConfig';

import {ArrayUtils} from '../classes/ArrayUtils';
import {DefaultProvider} from '../classes/DefaultProvider';
import {Provider} from '../classes/Provider';

export function Injectable(config: InjectableConfig) {
  return function(target: Constructor<any>) {
    const {token, type, providers: mayUndefinedProviders} = config;
    const providers = ArrayUtils.isNonemptyArray(mayUndefinedProviders)
      ? <Array<Provider>>(mayUndefinedProviders)
      : DefaultProvider.getInstance().getDefaultProvidersForRegistration();

    providers.forEach((provider) => {
      provider.register({
        provide: token,
        useClass: target,
        type: type || ServiceType.instantiation,
      });
    });

    return target;
  }
}

