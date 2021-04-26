class Provider {
  constructor() {
    this.registrations = {};
  }

  register({provide, useClass, type, dependencies}) {
    const {
      injectionToken,
      serviceClass,
      serviceType,
      dependencyTokens,
    } = this.preventInvalidRegisterInformation({provide, useClass, type, dependencies});
    if (this.registrations[injectionToken]) {
      throw new Error(`Injection token ${injectionToken} has been used`);
    } else {
      this.registrations[injectionToken] = {
        provide: injectionToken,
        useClass: serviceClass,
        type: serviceType,
        dependencies: dependencyTokens,
      };
    }
  }

  preventInvalidRegisterInformation({provide, useClass, type, dependencies}) {
    return {
      injectionToken: this.validateInjectionToken(provide),
      serviceClass: this.validateServiceClass(useClass),
      serviceType: this.validateServiceType(type),
      dependencyTokens: this.validateDependencyTokens(dependencies),
    };
  }

  validateInjectionToken(injectionToken) {
    if (!injectionToken || typeof injectionToken !== 'string') {
      throw new Error('Invalid injection token type: Injection token must be a string');
    }
    return injectionToken;
  }

  validateServiceClass(serviceClass) {
    if (!serviceClass || typeof serviceClass !== 'function') {
      throw new Error('Invalid service class: Service class must be a function');
    }
    return serviceClass;
  }

  validateServiceType(serviceType) {
    if (!serviceType) {
      return Provider.SERVICE_TYPES.instantiation;
    } else if (
      serviceType
      && serviceType !== Provider.SERVICE_TYPES.singleton
      && serviceType !== Provider.SERVICE_TYPES.instantiation
    ) {
      throw new Error('Invalid service type: Service type must be "singleton" or "instantiation"');
    }
    return serviceType;
  }

  validateDependencyTokens(dependencyTokens) {
    if (!dependencyTokens) {
      return [];
    } else if (dependencyTokens && !Array.isArray(dependencyTokens)) {
      throw new Error('Invalid dependency tokens: Dependency tokens must be a list of injection token');
    }
    return dependencyTokens;
  }

  getProviderConfigOfToken(injectionToken) {
    return this.registrations[injectionToken] || null;
  }

  isAbleToProvideToken(injectionToken) {
    return !!this.registrations[injectionToken];
  }
}

Provider.SERVICE_TYPES = {
  singleton: 'singleton',
  instantiation: 'instantiation',
};

module.exports = {Provider};
