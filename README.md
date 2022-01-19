# learn-ts-decorators

![Typescript](https://img.shields.io/badge/typescript-4.5.4-blue)

Learning the basics on how to create and use **Decorators** in Typescript.

```
npm install
npm start
```

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

## Person Class

```ts
@MyClassDecorator()
class Person {
    @MyPropertyDecorator()
    firstName: string = 'John';

    @MyPropertyDecorator()
    lastName: string = 'Doe';

    @MyPropertyDecorator()
    gender: string = 'M';

    @MyMethodDecorator()
    get fullName(): string {
        return this.firstName + ' ' + this.lastName;
    }

    @MyMethodDecorator()
    printName(): void {
        console.log(this.firstName + ' ' + this.lastName);
    }

    @MyMethodDecorator()
    sayHello(): void {
        console.log(`Hi my name is ${this.firstName} ${this.lastName}`);
    }

    say(@MyParameterDecorator() something: string, @MyParameterDecorator() anyValue: boolean): void {
        console.log(something);
        console.log(anyValue);
    }
}
```

## Decorators

Below is how decorators are declared and/or created

```ts
function MyClassDecorator(): ClassDecorator {
    return (target: Function) => {
        console.log(MyClassDecorator.name);
        console.log(target);
        console.log('-------------------------------------------------------------');
    };
}

function MyPropertyDecorator(): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        console.log(MyPropertyDecorator.name);
        console.log({ target, propertyKey });
        console.log('-------------------------------------------------------------');
    };
}

function MyMethodDecorator(): MethodDecorator {
    return <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
        console.log(MyMethodDecorator.name);
        console.log({ target, propertyKey, descriptor });
        console.log('-------------------------------------------------------------');
    };
}

function MyParameterDecorator(): ParameterDecorator {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
        console.log(MyParameterDecorator.name);
        console.log({ target, propertyKey, parameterIndex });
        console.log('-------------------------------------------------------------');
    };
}
```

## Log Output

```ts
MyPropertyDecorator
{
  target: {
    printName: [Function (anonymous)],
    sayHello: [Function (anonymous)],
    say: [Function (anonymous)]
  },
  propertyKey: 'firstName'
}
-------------------------------------------------------------
MyPropertyDecorator
{
  target: {
    printName: [Function (anonymous)],
    sayHello: [Function (anonymous)],
    say: [Function (anonymous)]
  },
  propertyKey: 'lastName'
}
-------------------------------------------------------------
MyPropertyDecorator
{
  target: {
    printName: [Function (anonymous)],
    sayHello: [Function (anonymous)],
    say: [Function (anonymous)]
  },
  propertyKey: 'gender'
}
-------------------------------------------------------------
MyMethodDecorator
{
  target: {
    printName: [Function (anonymous)],
    sayHello: [Function (anonymous)],
    say: [Function (anonymous)]
  },
  propertyKey: 'fullName',
  descriptor: {
    get: [Function: get],
    set: undefined,
    enumerable: false,
    configurable: true
  }
}
-------------------------------------------------------------
MyMethodDecorator
{
  target: {
    printName: [Function (anonymous)],
    sayHello: [Function (anonymous)],
    say: [Function (anonymous)]
  },
  propertyKey: 'printName',
  descriptor: {
    value: [Function (anonymous)],
    writable: true,
    enumerable: true,
    configurable: true
  }
}
-------------------------------------------------------------
MyMethodDecorator
{
  target: {
    printName: [Function (anonymous)],
    sayHello: [Function (anonymous)],
    say: [Function (anonymous)]
  },
  propertyKey: 'sayHello',
  descriptor: {
    value: [Function (anonymous)],
    writable: true,
    enumerable: true,
    configurable: true
  }
}
-------------------------------------------------------------
MyParameterDecorator
{
  target: {
    printName: [Function (anonymous)],
    sayHello: [Function (anonymous)],
    say: [Function (anonymous)]
  },
  propertyKey: 'say',
  parameterIndex: 1
}
-------------------------------------------------------------
MyParameterDecorator
{
  target: {
    printName: [Function (anonymous)],
    sayHello: [Function (anonymous)],
    say: [Function (anonymous)]
  },
  propertyKey: 'say',
  parameterIndex: 0
}
-------------------------------------------------------------
MyClassDecorator
[Function: Person]
-------------------------------------------------------------
John Doe
Hi my name is John Doe
```

### References

-   typescriptlang.org/docs/handbook/decorators.html

With the introduction of Classes in TypeScript and ES6, there now exist certain scenarios that require additional features to support annotating or modifying classes and class members. Decorators provide a way to add both annotations and a meta-programming syntax for class declarations and members. Decorators are a stage 2 proposal for JavaScript and are available as an experimental feature of TypeScript.
