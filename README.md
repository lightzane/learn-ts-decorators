# learn-ts-decorators

![Typescript](https://img.shields.io/badge/typescript-5.2.2-blue)

Learning the basics on how to create and use **Decorators** in Typescript.

```
npm install
npm start
```

After `npm start` the output would look like [this](#log-output)

**tsconfig.json**

The following `compilerOptions` is **important** to enable use of Decorators in Typescript

```json
{
  "compilerOptions": {
    "target": "es5",
    "experimentalDecorators": true
  }
}
```

## Sample Class

```ts
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

// ! This will become empty array [] if the 2nd defineProperty inside "set()" is not provided (see decorator)
console.log(Object.keys(sample)); // => [ 'defaultValue', 'defaultNum', 'value' ]
```

## Decorators

Below is how decorators are declared and/or created

```ts
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
```

## Log Output

Output would look like this after `npm start`

```bash
defaultValue
10
undefined
25
[ 'defaultValue', 'defaultNum', 'value' ]
```

### References

- https://www.typescriptlang.org/docs/handbook/decorators.html

With the introduction of Classes in TypeScript and ES6, there now exist certain scenarios that require additional features to support annotating or modifying classes and class members. Decorators provide a way to add both annotations and a meta-programming syntax for class declarations and members. Decorators are a stage 2 proposal for JavaScript and are available as an experimental feature of TypeScript.
