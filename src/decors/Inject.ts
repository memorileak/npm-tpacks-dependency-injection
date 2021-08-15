import {InjectConfig} from '../structs/InjectConfig';
import {Constructor} from '../types/Constructor';

import {Injector} from '../classes/Injector';
import {ArrayUtils} from '../classes/ArrayUtils';
import {DefaultProvider} from '../classes/DefaultProvider';
import {Provider} from '../classes/Provider';

export function Inject(config: InjectConfig) {
  return function(target: Constructor<any>): Constructor<any> {
    return class extends target {
      constructor(...args: Array<any>) {
        super(...args);
        this.acceptDependencies();
      }

      acceptDependencies(): any {
        const {dependencies, providers: mayUndefinedProviders} = config;
        const providers = ArrayUtils.isNonemptyArray(mayUndefinedProviders)
          ? <Array<Provider>>(mayUndefinedProviders)
          : DefaultProvider.getInstance().getDefaultProvidersForInjection();
        const injector = (new Injector()).withProviders(providers);
        const depInstances: Array<any> = injector.getServicesOfTokens(dependencies);
        super.acceptDependencies(...depInstances);
      }
    }
  }
}
