# Logger

Implement loggers via **Typescript Decorators**.

- [`console.log`](#consolelog)
- [`winston`](#winston)

## Prerequisite

Enable this in `tsconfig.json`

```json
{
  /* Enable experimental support for legacy experimental decorators. */
  "experimentalDecorators": true
}
```

## Demo

```bash
npm ci
npm run build
npm start
```

## console.log

### Decorator

`console-log.decorator.ts`

```ts
export function ConsoleLogger(): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const className = target.constructor.name; // Get the class name
    const isAwaiter = /__awaiter/.test(originalMethod.toString());

    const logger = (responseTime: number) => {
      console.log(
        `[Class] ${className} [Method] ${String(
          propertyKey,
        )} took ${responseTime}ms`,
      );
    };

    // * ASYNC Function
    if (isAwaiter) {
      descriptor.value = async function (...args: unknown[]) {
        const startTime = Date.now();
        const result = await originalMethod.apply(this, args);
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        logger(responseTime);

        return result;
      };
    }

    // * SYNC Function
    else {
      descriptor.value = function (...args: unknown[]) {
        const startTime = Date.now();
        const result = originalMethod.apply(this, args);
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        logger(responseTime);

        return result;
      };
    }

    return descriptor;
  };
}
```

### In action

`index.ts`

```ts
import { ConsoleLogger } from './decorators';

class FruitManager {
  private items: string[] = [];

  @ConsoleLogger()
  async getItems() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return this.items;
  }

  @ConsoleLogger()
  addItems(...fruits: string[]) {
    this.items.push(...fruits);
  }
}

const manager = new FruitManager();

manager.addItems('apple', 'banana', 'cherry', 'lemon');
manager.getItems().then(console.log);

// -> [Class] FruitManager [Method] addItems took 0ms
// -> [Class] FruitManager [Method] getItems took 3016ms
// -> [ 'apple', 'banana', 'cherry', 'lemon' ]
```

## Winston

TODO
