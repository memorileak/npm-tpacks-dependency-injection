import {InjectionToken} from '../types/InjectionToken';
import {Provider} from '../classes/Provider';

export interface InjectConfig {
  dependencies: Array<InjectionToken>,
  providers?: Array<Provider>,
}
