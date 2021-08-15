import {ArrayUtils} from './ArrayUtils';
import {Provider} from './Provider';

export class DefaultProvider {
  private static instance: DefaultProvider | null = null;
  private registrationProviders: Array<Provider>;
  private injectionProviders: Array<Provider>;
  private registeringProviders: Array<Provider>;
  private unregisteringProviders: Array<Provider>;

  static getInstance(): DefaultProvider {
    if (!DefaultProvider.instance) {
      DefaultProvider.instance = new DefaultProvider();
    }
    return DefaultProvider.instance;
  }

  private constructor() {
    this.registrationProviders = [];
    this.injectionProviders = [];
    this.registeringProviders = [];
    this.unregisteringProviders = [];
  }

  register(...providers: Array<Provider>): DefaultProvider {
    this.registeringProviders = [...providers];
    return this;
  }

  unregister(...providers: Array<Provider>): DefaultProvider {
    this.unregisteringProviders = [...providers];
    return this;
  }

  forRegistration(): DefaultProvider {
    this.registrationProviders = ArrayUtils.unique<Provider>(
      this.registrationProviders.concat(this.registeringProviders),
    );
    this.registrationProviders = this.registrationProviders
      .filter((provider) => !this.unregisteringProviders.includes(provider));
    return this;
  }

  forInjection(): DefaultProvider {
    this.injectionProviders = ArrayUtils.unique<Provider>(
      this.injectionProviders.concat(this.registeringProviders),
    );
    this.injectionProviders = this.injectionProviders
      .filter((provider) => !this.unregisteringProviders.includes(provider));
    return this;
  }

  getDefaultProvidersForRegistration(): Array<Provider> {
    return [...this.registrationProviders];
  }

  getDefaultProvidersForInjection(): Array<Provider> {
    return [...this.injectionProviders];
  }
}
