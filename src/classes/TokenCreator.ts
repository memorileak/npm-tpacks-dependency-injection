import {nanoid} from 'nanoid';

export class TokenCreator {
  static create(): string {
    return nanoid();
  }
}
