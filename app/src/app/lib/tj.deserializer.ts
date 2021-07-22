enum ValueCheckingMode {
    ALLOW_NULL = 1,
    ALLOW_OBJECT_NULL = 2,
    DISALLOW_NULL = 3
};
class Settings {
    static readonly MAPPING_PROPERTY = '__jsonconvert__mapping__';
    static readonly MAPPER_PROPERTY = '__jsonconvert__mapper__';
};
class MappingOptions {
    classPropertyName: string = '';
    jsonPropertyName: string = '';
    expectedJsonType?: string = undefined;
    isOptional: boolean = false;
    customConverter: any = null;
}

// Decorator of a class that comes from a JSON object.
export function JsonObject(target: any) {
    target[Settings.MAPPING_PROPERTY] = [];
}

/**
* Decorator of a class property that comes from a JSON object.
*
* The second param can be either a type or a class of a custom converter.
*
* Use the following notation for the type:
* - Primitive type: String|Number|Boolean
* - Custom type: YourClassName
* - Array type: [String|Number|Boolean|YourClassName]
*
* If you decide to use a custom converter, make sure this class implements the interface JsonCustomConvert from this package.
*
* @param jsonPropertyName optional param (default: classPropertyName) the property name in the expected JSON object
* @param conversionOption optional param (default: Any), should be either the expected type (String|Boolean|Number|etc)
* or a custom converter class implementing JsonCustomConvert
* @param isOptional optional param (default: false), if true, the json property does not have to be present in the object
*
* @returns {(target:any, key:string)=>void}
*/
export function JsonProperty(...params: any[]): any {
    // target: Protoype of the class
    // classPropertyName: Name of the member
    return function (target: any, classPropertyName: string): void {
        let jsonPropertyName: string = classPropertyName;
        let conversionOption: any = class Any { };
        let isOptional: boolean = false;

        switch (params.length) {
            case 0:
                break;
            case 1:
                jsonPropertyName = params[0];
                break;
            case 2:
                if (params[1] === undefined) {
                    throw new Error(`
                        It's not allowed to explicitely pass \'undefined\' as second parameter in the @JsonProperty decorator.\n\n
                        \tClass name: \n\t\ttarget.constructor.name\n\n'\tClass property: \n\t\t
                        classPropertyName\n\n`
                    );
                }
                jsonPropertyName = params[0];
                conversionOption = params[1];
                break;
            case 3:
                jsonPropertyName = params[0];
                conversionOption = params[1];
                isOptional = params[2];
                break;
            default:
                break;
        }


        if (typeof (target[Settings.MAPPING_PROPERTY]) === 'undefined') {
            target[Settings.MAPPING_PROPERTY] = [];
        }

        const className = target.constructor.name;

        if (typeof (jsonPropertyName) === 'undefined') {
            jsonPropertyName = classPropertyName;
        }


        const jsonPropertyMappingOptions = new MappingOptions();
        jsonPropertyMappingOptions.classPropertyName = classPropertyName;
        jsonPropertyMappingOptions.jsonPropertyName = jsonPropertyName;
        jsonPropertyMappingOptions.isOptional = isOptional ? isOptional : false;

        jsonPropertyMappingOptions.expectedJsonType = conversionOption;

        // Save the mapping info
        target[Settings.MAPPING_PROPERTY][className + '.' + classPropertyName] = jsonPropertyMappingOptions;

    }

}

export class JsonConvert {

    /**
     * Determines which types are allowed to be null.
     *
     * You may assign three different values:
     * - ValueCheckingMode.ALLOW_NULL: all given values in the JSON are allowed to be null
     * - ValueCheckingMode.ALLOW_OBJECT_NULL: objects in the JSON are allowed to be null, primitive types are not allowed to be null
     * - ValueCheckingMode.DISALLOW_NULL: no null values are tolerated in the JSON
     */
    private _valueCheckingMode: number = ValueCheckingMode.ALLOW_OBJECT_NULL;
    errors = [];
    get valueCheckingMode(): number {
        return this._valueCheckingMode;
    }

    set valueCheckingMode(value: number) {
        if (value in ValueCheckingMode) {
            this._valueCheckingMode = value;
        }
    }

    /**
     * Determines whether primitive types should be checked.
     * If true, it will be allowed to assign primitive to other primitive types.
     */
    private _ignorePrimitiveChecks: boolean = false;

    /**
     * Determines whether primitive types should be checked.
     * If true, it will be allowed to assign primitive to other primitive types.
     *
     * @returns {boolean}
     */
    get ignorePrimitiveChecks(): boolean {
        return this._ignorePrimitiveChecks;
    }

    /**
     * Determines whether primitive types should be checked.
     * If true, it will be allowed to assign primitive to other primitive types.
     *
     * @param value
     */
    set ignorePrimitiveChecks(value: boolean) {
        this._ignorePrimitiveChecks = value;
    }

    /**
     * To learn more about the params, check the documentation of the equally named class properties.
     *
     * @param valueCheckingMode optional param (default: ValueCheckingMode.ALLOW_OBJECT_NULL)
     * @param ignorePrimitiveChecks optional param (default: false)
     */
    constructor(valueCheckingMode?: number, ignorePrimitiveChecks?: boolean) {
        if (valueCheckingMode && valueCheckingMode in ValueCheckingMode) {
            this.valueCheckingMode = valueCheckingMode;
        }
        if (ignorePrimitiveChecks) {
            this.ignorePrimitiveChecks = ignorePrimitiveChecks;
        }
    }

    /**
     * Tries to deserialize given JSON to a TypeScript object or array of objects.
     *
     * @param json the JSON as object or array
     * @param classReference the class reference
     *
     * @returns {any} the deserialized data (TypeScript instance or array of TypeScript instances)
     *
     * @throws an exception in case of failure
     */
    deserialize(json: any, classReference: { new(): any }): any {
        this.errors = [];

        if (json.constructor === Array) {
            return { instance: this.deserializeArray(json, classReference), errors: this.errors };
        }
        if (typeof json === 'object') {// must be last due to the fact that an array is an object in TypeScript!
            return { instance: this.deserializeObject(json, classReference), errors: this.errors };
        };

        return new Error(
            'Passed parameter json is not in valid JSON format (object or array).'
        );

    };

    /**
     * Tries to deserialize a JSON object to a TypeScript object.
     *
     * @param jsonObject the JSON object
     * @param classReference the class reference
     *
     * @returns {any} the deserialized TypeScript instance and @returns an exception in case of failure
     */
    deserializeObject(jsonObject: any, classReference: { new(): any }): any {
        if (typeof (jsonObject) !== 'object' || jsonObject instanceof Array) {
            return new Error(
                'Passed parameter jsonObject is not of type object.'
            );
        }

        const instance = new classReference();
        // Loop through all initialized class properties
        for (const propertyKey of Object.keys(jsonObject)) {
            try {
                this.deserializeObject_loopProperty(instance, propertyKey, jsonObject);
            } catch (error) {
                if (this.errors.findIndex(value => value.message === error.message) === -1) {
                    this.errors.push(error);
                }
            }
        }
        return instance;
    }

    /**
     * Tries to deserialize a JSON array to a TypeScript array.
     *
     * @param jsonArray the JSON array
     * @param classReference the object class
     *
     * @returns {any[]} the deserialized array of TypeScript instances
     *
     * @throws an exception in case of failure
     */
    deserializeArray(jsonArray: any[], classReference: { new(): any }): any {

        if (typeof (jsonArray) !== 'object' || jsonArray instanceof Array === false) {
            return new Error(
                'Passed parameter jsonArray is not of type array.'
            );
        }

        const array: any[] = [];
        // Loop through all array elements
        for (const jsonObject of jsonArray) {
            const des = this.deserializeObject(jsonObject, classReference);
            array.push(des.instance);
            this.errors.push(des.errors);
        }
        return array;
    }

    /**
     * Tries to find the JSON mapping for a given class property and finally assign the value.
     *
     * @param instance the instance of the class
     * @param classPropertyName the property name
     * @param json the JSON object
     *
     * @throws throws an expection in case of failure
     */
    private deserializeObject_loopProperty(instance: any, classPropertyName: string, json: any): void {
        const mappingOptions: MappingOptions | null = this.getClassPropertyMappingOptions(instance, classPropertyName);
        if (mappingOptions === null) {
            throw new Error(
                `Invalid property: ${classPropertyName}. Does not exist in Data Model ${instance.constructor.name}`
            );
        }
        // Get expected and real values
        const jsonKey: string = mappingOptions.jsonPropertyName;
        const expectedJsonType: any = mappingOptions.expectedJsonType;
        const isOptional: boolean = mappingOptions.isOptional;

        const jsonValue: any = json[jsonKey];
        // Check if the json value exists
        if (typeof (jsonValue) === 'undefined') {
            if (isOptional) {
                return;
            }

            throw new Error(
                'Failed to map the JSON object to the Data Model \'' + instance.constructor['name'] +
                '\tbecause the defined JSON property \'' + jsonKey + '\' does not exist:\n\n' +
                '\tModel property: \n\t\t' + classPropertyName + '\n\n' +
                '\tJSON property: \n\t\t' + jsonKey + '\n\n'
            );
        }


        // Map the property
        try {
            instance[classPropertyName] = this.verifyProperty(expectedJsonType, jsonValue);
            json[jsonKey] = instance[classPropertyName];
        } catch (e) {
            throw new Error(
                'Failed to map the JSON object to the Data Model\'' +
                instance.constructor['name'] + '\' because of a type error.\n\n' +
                '\tData Model property: \n\t\t' + classPropertyName + '\n\n' +
                '\tExpected type: \n\t\t' + this.getExpectedType(expectedJsonType) + '\n\n' +
                '\tJSON property: \n\t\t' + jsonKey + '\n\n' +
                '\tJSON type: \n\t\t' + this.getJsonType(jsonValue) + '\n\n' +
                '\tJSON value: \n\t\t' + JSON.stringify(jsonValue) + '\n\n' +
                e.message + '\n\n'
            );
        }
    }

    /**
     * Gets the mapping options of a given class property.
     *
     * @param instance any class instance
     * @param {string} propertyName any property name
     *
     * @returns {MappingOptions|null}
     */
    private getClassPropertyMappingOptions(instance: any, propertyName: string): MappingOptions | null {

        let mappings: any = instance[Settings.MAPPING_PROPERTY];

        // Check if mapping is defined
        if (typeof (mappings) === 'undefined') {
            return null;
        }

        // Get direct mapping if possible
        const directMappingName: string = instance.constructor.name + '.' + propertyName;
        if (typeof (mappings[directMappingName]) !== 'undefined') {
            return mappings[directMappingName];
        }

        // No mapping was found, try to find some
        const indirectMappingNames: string[] = Object.keys(mappings).filter(key => key.match('\\.' + propertyName + '$'));
        // use endsWidth in later versions
        if (indirectMappingNames.length > 0) {
            return mappings[indirectMappingNames[0]];
        }

        return null;

    }

    /**
     * Compares the type of a given value with an internal expected json type.
     * Either returns the resulting value or throws an exception.
     *
     * @param expectedJsonType the expected json type for the property
     * @param value the property value to verify
     * @param serialize optional param (default: false), if given, we are in serialization mode
     *
     * @returns returns the resulted mapped property
     *
     * @throws throws an expection in case of failure
     */
    private verifyProperty(expectedJsonType: any, value: any, serialize?: boolean): any {
        // Map immediately if we don't care about the type
        if (expectedJsonType === null || expectedJsonType === Object) {
            return value;
        }
        // Check if attempt and expected was 1-d
        if (expectedJsonType instanceof Array === false && value instanceof Array === false) {
            // Check the type
            if (typeof (expectedJsonType) !== 'undefined'
                && expectedJsonType.hasOwnProperty(Settings.MAPPING_PROPERTY)) {
                // only decorated custom objects have this injected property

                // Check if we have null value
                if (value === null) {
                    if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL) {
                        return null;
                    } else {
                        throw new Error('\tReason: Given value is null.');
                    }
                }

                return this.deserializeObject(value, expectedJsonType);

            } else if (expectedJsonType === null || expectedJsonType === Object) { // general object

                // Check if we have null value
                if (value === null) {
                    if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL) {
                        return null;
                    } else {
                        throw new Error('\tReason: Given value is null.');
                    }
                }

                return value;

            } else if (expectedJsonType === String ||
                expectedJsonType === Number || expectedJsonType === Boolean) { // otherwise check for a primitive type
                // Check if we have null value
                if (value === null) {
                    if (this.valueCheckingMode === ValueCheckingMode.ALLOW_NULL) {
                        return null;
                    } else {
                        throw new Error('\tReason: Given value is null.');
                    }
                }

                // Check if the types match
                if ( // primitive types match
                    (expectedJsonType === String && typeof (value) === 'string') ||
                    (expectedJsonType === Number && typeof (value) === 'number') ||
                    (expectedJsonType === Boolean && typeof (value) === 'boolean')
                ) {
                    return value;
                } else { // primitive types mismatch
                    if (this.ignorePrimitiveChecks) {
                        return value;
                    }
                    throw new Error('\tReason: Given object does not match the expected primitive type.');
                }
            } else if (typeof expectedJsonType === 'function' && expectedJsonType.prototype.constructor.name === 'Date') {
                if (!value) {
                    throw new Error('\tReason: Expected type is Date. Got invalid date ' + JSON.stringify(value));
                }
                try {
                    if (!isNaN(Date.parse(value))) {
                        value = { '$date': new Date(value) };
                    } else {
                        throw new Error('\tReason: Expected type is Date. Got invalid date ' + JSON.stringify(value));
                    }
                } catch (error) {
                    throw new Error('\tReason: Expected type is Date. Got invalid date ' + JSON.stringify(value));
                }
                return value;
            } else { // other weird types
                throw new Error(`\tReason: Expected type is unknown. There might be multiple reasons for this:
                \n\t- You are missing the decorator @JsonObject (for object mapping)\n\t-
                You are missing the decorator @JsonConverter (for custom mapping) before your class definition\n\t-
                Your given class is undefined in the decorator because of circular dependencies`);
            }
        }
        // Check if attempt and expected was n-d
        if (expectedJsonType instanceof Array && value instanceof Array) {

            const array: any[] = [];

            // No data given, so return empty value
            if (value.length === 0) {
                return array;
            }

            // We obviously don't care about the type, so return the value as is
            if (expectedJsonType.length === 0) {
                return value;
            }

            // Loop through the data. Both type and value are at least of length 1
            const autofillType: boolean = expectedJsonType.length < value.length;
            for (let i = 0; i < value.length; i++) {

                if (autofillType && i >= expectedJsonType.length) {
                    expectedJsonType[i] = expectedJsonType[i - 1];
                }

                array[i] = this.verifyProperty(expectedJsonType[i], value[i], serialize);

            }

            return array;

        }

        // Check if attempt was 1-d and expected was n-d
        if (expectedJsonType instanceof Array && value instanceof Object) {

            const array: any[] = [];

            // No data given, so return empty value
            if (value.length === 0) {
                return array;
            }

            // We obviously don't care about the type, so return the json value as is
            if (expectedJsonType.length === 0) {
                return value;
            }

            // Loop through the data. Both type and value are at least of length 1
            const autofillType: boolean = expectedJsonType.length < Object.keys(value).length;
            let i = 0;
            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    if (autofillType && i >= expectedJsonType.length) {
                        expectedJsonType[i] = expectedJsonType[i - 1];
                    }
                    array[key as any] = this.verifyProperty(expectedJsonType[i], value[key]);
                    i++;
                }
            }

            return array;

        }

        // Check if attempt was 1-d and expected was n-d
        if (expectedJsonType instanceof Array) {
            if (value === null) {
                if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL) {
                    return null;
                } else { throw new Error('\tReason: Given value is null.'); }
            }
            throw new Error('\tReason: Expected type is array, but given value is non-array.');
        }

        // Check if attempt was n-d and expected as 1-d
        if (value instanceof Array) {
            throw new Error('\tReason: Given value is array, but expected a non-array type.');
        }

        // All other attempts are fatal
        throw new Error('\tReason: Mapping failed because of an unknown error.');

    }

    // Returns a string representation of the expected json type.
    private getExpectedType(expectedJsonType: any): string {

        let type: string = '';

        if (expectedJsonType instanceof Array) {
            type = '[';
            for (let i = 0; i < expectedJsonType.length; i++) {
                if (i > 0) { type += ','; }
                type += this.getExpectedType(expectedJsonType[i]);
            }
            type += ']';
            return type;
        } else {
            if (expectedJsonType === null || expectedJsonType === Object) {
                return 'any';
            } else if (expectedJsonType === String || expectedJsonType == Boolean || expectedJsonType == Number) {
                return (new expectedJsonType()).constructor.name.toLowerCase();
            } else if (typeof expectedJsonType === 'function') {
                return (new expectedJsonType()).constructor.name;
            } else if (expectedJsonType === undefined) {
                return 'undefined'
            } else {
                return '?????';
            }
        }

    }

    // Returns a string representation of the JSON value type
    private getJsonType(jsonValue: any): string {

        if (jsonValue === null) {
            return 'null';
        }
        let type: string = '';

        if (jsonValue instanceof Array) {
            type = '[';
            for (let i = 0; i < jsonValue.length; i++) {
                if (i > 0) { type += ','; }
                type += this.getJsonType(jsonValue[i]);
            }
            type += ']';
            return type;
        } else if (Object.prototype.toString.call(jsonValue) === '[object Date]') {
            return 'Date';
        } else {
            return typeof (jsonValue);
        }

    }

}
