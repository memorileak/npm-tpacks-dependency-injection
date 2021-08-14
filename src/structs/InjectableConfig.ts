import {InjectionToken} from '../types/InjectionToken';
import {ServiceType} from '../types/ServiceType';
import {Provider} from '../classes/Provider';

export interface InjectableConfig {
  token: InjectionToken,
  type?: ServiceType,
  providers: Array<Provider>,
}
