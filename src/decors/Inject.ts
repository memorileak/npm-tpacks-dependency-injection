import {InjectConfig} from '../structs/InjectConfig';

import {Injector} from '../classes/Injector';
import {Constructor} from '../types/Constructor';

export function Inject(config: InjectConfig) {
  return function(target: Constructor<any>): Constructor<any> {
    return class extends target {
      constructor(...args: Array<any>) {
        super(...args);
        this.acceptDependencies();
      }

      acceptDependencies(): any {
        const {dependencies, providers} = config;
        const injector = (new Injector()).withProviders(providers);
        const depInstances: Array<any> = injector.getServicesOfTokens(dependencies);
        super.acceptDependencies(...depInstances);
      }
    }
  }
}
