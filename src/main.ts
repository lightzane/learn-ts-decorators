function Transform(
  transformFn?: (propertyValue: any) => any
): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    let value: any;

    Object.defineProperty(target, propertyKey, {
      get: () => value,
      set: function (newValue: any) {
        value = !!transformFn ? transformFn(newValue) : newValue;

        // ! Need to define another Object.defineProperty()
        // * In order for Object.keys() filled with keys from the instance created
        // * Without this defineProperty, Object.keys() will return empty array even with enumerable: true
        Object.defineProperty(this, propertyKey, {
          get: () => value,
          enumerable: true, // When true, prop will be enumerated via Object.keys()
          configurable: true, // When false, property cannot be deleted, etc.
        });
      },
    });
  };
}

class Sample {
  @Transform()
  defaultValue = 'defaultValue';

  defaultNum = 10;

  @Transform((value) => value * 5)
  value?: number;
}

const sample = new Sample();

console.log(sample.defaultValue); // => 'defaultValue'
console.log(sample.defaultNum); // => 10
console.log(sample.value); // => undefined

sample.value = 5;
console.log(sample.value); // => 25 (mutated using the transformFn)

// ! This will become empty array [] if the 2nd defineProperty inside "set()" is not provided
console.log(Object.keys(sample)); // => [ 'defaultValue', 'defaultNum', 'value' ]
