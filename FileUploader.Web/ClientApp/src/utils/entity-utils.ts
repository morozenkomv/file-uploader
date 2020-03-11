export default class EntityUtils {
  static isEmpty(obj: any) {
    for (const key in obj)
      if (obj[key] !== null && obj[key] !== '')
        return false;
    return true;
  }

  static toLower(obj: any): any {
    let newObj: any, origKey, newKey, value;
    if (obj instanceof Array) {
      newObj = [];
      for (origKey in obj)
        if (obj.hasOwnProperty(origKey)) {
          value = obj[origKey];
          if (typeof value === 'object')
            value = this.toLower(value);
          newObj.push(value);
        }
    } else {
      newObj = {};
      for (origKey in obj)
        if (obj.hasOwnProperty(origKey)) {
          newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
          value = obj[origKey];
          if (value instanceof Array || (value !== null && value.constructor === Object))
            value = this.toLower(value);

          newObj[newKey] = value;
        }
    }
    return newObj;
  }

  static toLowerKeys(obj: any): any {
    if (!obj)
      return null;

    if (typeof obj === 'string')
      return obj;

    let newObj: any, origKey, newKey, value;
    if (obj instanceof Array) {
      newObj = [];
      for (origKey in obj)
        if (obj.hasOwnProperty(origKey)) {
          value = obj[origKey];
          if (typeof value === 'object')
            value = this.toLowerKeys(value);
          newObj.push(value);
        }
    } else {
      newObj = {};
      for (origKey in obj)
        if (obj.hasOwnProperty(origKey)) {
          newKey = origKey.toLowerCase().toString();
          value = obj[origKey];
          if (value instanceof Array || (value !== null && value.constructor === Object))
            value = this.toLowerKeys(value);
          newObj[newKey] = value;
        }
    }
    return newObj;
  }

  static toCamel(obj: any): any {
    let newObj: any, origKey, newKey, value;
    if (obj instanceof Array) {
      newObj = [];
      for (origKey in obj)
        if (obj.hasOwnProperty(origKey)) {
          value = obj[origKey];
          if (typeof value === 'object')
            value = this.toCamel(value);

          newObj.push(value);
        }
    } else {
      newObj = {};
      for (origKey in obj)
        if (obj.hasOwnProperty(origKey)) {
          newKey = (origKey.charAt(0).toUpperCase() + origKey.slice(1) || origKey).toString();
          value = obj[origKey];
          if (value instanceof Array || (value !== null && value.constructor === Object))
            value = this.toCamel(value);
          newObj[newKey] = value;
        }
    }
    return newObj;
  }

  static toInstance<T>(instance: any, jsonObj: any): T {
    const obj = typeof jsonObj === 'string' ? JSON.parse(jsonObj) : jsonObj;
    if (!obj)
      return null;

    for (const propName in obj) {
      if (!obj.hasOwnProperty(propName))
        continue;
      instance[propName] = obj[propName];
    }
    return instance;
  }

  static copy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj)) as T;
  }

  static copyArray<T>(arr: T): T {
    return;
  }
}
