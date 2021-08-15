export class ArrayUtils {
  static unique<T>(arr: Array<T>): Array<T> {
    const trackingMap = new Map();
    const result: Array<T> = [];
    for (let i = 0; i < arr.length; i += 1) {
      if (!trackingMap.has(arr[i])) {
        result.push(arr[i]);
        trackingMap.set(arr[i], true);
      }
    }
    return result;
  }

  static isNonemptyArray(x: any): boolean {
    return Array.isArray(x) && x.length > 0;
  }
}
