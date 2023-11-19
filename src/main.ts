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
    return (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
        console.log(MyParameterDecorator.name);
        console.log({ target, propertyKey, parameterIndex });
        console.log('-------------------------------------------------------------');
    };
}

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

const person1 = new Person();
person1.printName();
person1.sayHello();


// ? my first decorator
// function First() {
//     console.log('First(): factory evaluated');
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         console.log('First(): called');
//     };
// }

// function Second() {
//     console.log('Second(): factory evaluated');
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         console.log('Second(): called');
//     };
// }

// class ExampleClass {
//     @Second()
//     @First()
//     method() { }
// }
