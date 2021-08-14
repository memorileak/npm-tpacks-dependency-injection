import {Constructor} from '../types/Constructor';
import {ServiceType} from '../types/ServiceType';
import {InjectableConfig} from '../structs/InjectableConfig';

export function Injectable(config: InjectableConfig) {
  return function(target: Constructor<any>) {
    const {token, type, providers} = config;
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

