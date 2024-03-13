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

### Custom format

Enable consumers to provide their custom format by providing config params in the decorator.

Add `config` params and update the `logger()` inside the decorator

```ts
type FormatData = {
  className: string;
  methodName: string;
  responseTime: number;
};

type ConsoleLoggerConfig = {
  format: (data: FormatData) => string;
};

export function ConsoleLogger(config?: ConsoleLoggerConfig): MethodDecorator {
  // ...rest of code here (hidden for brevity)

  const logger = (responseTime: number) => {
    // Default format
    if (!config || !config.format) {
      console.log(
        `[Class] ${className} [Method] ${String(
          propertyKey,
        )} took ${responseTime}ms`,
      );
      return;
    }

    // Custom format
    const custom = config.format({
      className,
      methodName: String(propertyKey),
      responseTime,
    });

    console.log(custom);
  };

  // ...rest of code here
}
```

### Usage

`index.ts` - Update the method decorators within `FruitManager` class

```ts
@ConsoleLogger({
    format: ({ methodName, responseTime }) => `${methodName}=${responseTime}ms`,
})
async getItems() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return this.items;
}

@ConsoleLogger({ format: () => `adding items...` })
addItems(...fruits: string[]) {
    this.items.push(...fruits);
}
```

**Output**

```bash
adding items...
getItems=3019ms
[ 'apple', 'banana', 'cherry', 'lemon' ]
```

## Winston

TODO
