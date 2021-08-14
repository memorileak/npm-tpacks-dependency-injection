import {Constructor} from '../types/Constructor';
import {InjectionToken} from '../types/InjectionToken';
import {ServiceType} from '../types/ServiceType';
import {DepRegisterInfo, FullDepRegisterInfo} from '../structs/DepRegisterInfo';

export class Provider {
  private registrations: Record<InjectionToken, FullDepRegisterInfo>;

  constructor() {
    this.registrations = {};
  }

  register(registerInfo: DepRegisterInfo): void {
    const validRegisterInfo: FullDepRegisterInfo = this.preventInvalidRegisterInformation(registerInfo);
    if (this.registrations[validRegisterInfo.provide]) {
      throw new Error(`Injection token ${validRegisterInfo.provide} has been used`);
    } else {
      this.registrations[validRegisterInfo.provide] = validRegisterInfo;
    }
  }

  private preventInvalidRegisterInformation(registerInfo: DepRegisterInfo): FullDepRegisterInfo {
    return {
      provide: this.validateInjectionToken(registerInfo.provide),
      useClass: this.validateServiceClass(registerInfo.useClass),
      type: this.validateServiceType(registerInfo.type),
    };
  }

  private validateInjectionToken(injectionToken: InjectionToken): InjectionToken {
    if (!injectionToken || typeof injectionToken !== 'string') {
      throw new Error('Invalid injection token type: Injection token must be a string');
    }
    return injectionToken;
  }

  private validateServiceClass(serviceClass: Constructor<any>): Constructor<any> {
    if (!serviceClass || typeof serviceClass !== 'function') {
      throw new Error('Invalid service class: Service class must be a function');
    }
    return serviceClass;
  }

  private validateServiceType(serviceType?: ServiceType): ServiceType {
    if (!serviceType) {
      return ServiceType.instantiation;
    } else if (
      serviceType
      && serviceType !== ServiceType.singleton
      && serviceType !== ServiceType.instantiation
    ) {
      throw new Error('Invalid service type: Service type must be "singleton" or "instantiation"');
    }
    return serviceType;
  }

  getProviderConfigOfToken(injectionToken: InjectionToken): FullDepRegisterInfo {
    return this.registrations[injectionToken];
  }

  isAbleToProvideToken(injectionToken: InjectionToken): boolean {
    return !!this.registrations[injectionToken];
  }
}
