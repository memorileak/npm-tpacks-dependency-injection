import {Constructor} from '../types/Constructor';
import {InjectionToken} from '../types/InjectionToken';
import {ServiceType} from '../types/ServiceType';

export interface DepRegisterInfo {
  provide: InjectionToken, 
  useClass: Constructor<any>, 
  type?: ServiceType, 
  dependencies?: Array<InjectionToken>,
}

export interface FullDepRegisterInfo {
  provide: InjectionToken, 
  useClass: Constructor<any>, 
  type: ServiceType, 
  dependencies: Array<InjectionToken>,
}
