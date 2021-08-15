import {nanoid} from 'nanoid';

import {InjectionToken} from '../types/InjectionToken';

export class TokenCreator {
  static create(): InjectionToken {
    return <InjectionToken>(nanoid());
  }
}
