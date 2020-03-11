"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntityUtils = /** @class */ (function () {
    function EntityUtils() {
    }
    EntityUtils.isEmpty = function (obj) {
        for (var key in obj)
            if (obj[key] !== null && obj[key] !== '')
                return false;
        return true;
    };
    EntityUtils.toLower = function (obj) {
        var newObj, origKey, newKey, value;
        if (obj instanceof Array) {
            newObj = [];
            for (origKey in obj)
                if (obj.hasOwnProperty(origKey)) {
                    value = obj[origKey];
                    if (typeof value === 'object')
                        value = this.toLower(value);
                    newObj.push(value);
                }
        }
        else {
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
    };
    EntityUtils.toLowerKeys = function (obj) {
        if (!obj)
            return null;
        if (typeof obj === 'string')
            return obj;
        var newObj, origKey, newKey, value;
        if (obj instanceof Array) {
            newObj = [];
            for (origKey in obj)
                if (obj.hasOwnProperty(origKey)) {
                    value = obj[origKey];
                    if (typeof value === 'object')
                        value = this.toLowerKeys(value);
                    newObj.push(value);
                }
        }
        else {
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
    };
    EntityUtils.toCamel = function (obj) {
        var newObj, origKey, newKey, value;
        if (obj instanceof Array) {
            newObj = [];
            for (origKey in obj)
                if (obj.hasOwnProperty(origKey)) {
                    value = obj[origKey];
                    if (typeof value === 'object')
                        value = this.toCamel(value);
                    newObj.push(value);
                }
        }
        else {
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
    };
    EntityUtils.toInstance = function (instance, jsonObj) {
        var obj = typeof jsonObj === 'string' ? JSON.parse(jsonObj) : jsonObj;
        if (!obj)
            return null;
        for (var propName in obj) {
            if (!obj.hasOwnProperty(propName))
                continue;
            instance[propName] = obj[propName];
        }
        return instance;
    };
    EntityUtils.copy = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };
    EntityUtils.copyArray = function (arr) {
        return;
    };
    return EntityUtils;
}());
exports.default = EntityUtils;
//# sourceMappingURL=entity-utils.js.map