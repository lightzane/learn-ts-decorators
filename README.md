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

`log.decorator.ts`

```ts
export function Log(): MethodDecorator {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;
    const className = target.constructor.name; // Get the class name
    const isAwaiter = /__awaiter/.test(originalMethod.toString());

    const log = (responseTime: number) => {
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

        log(responseTime);

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

        log(responseTime);

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
import { Log } from './decorators';

class FruitManager {
  private items: string[] = [];

  @Log()
  async getItems() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return this.items;
  }

  @Log()
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

Add `config` params and update the `log()` inside the `Log` decorator

```ts
type FormatData = {
  className: string;
  methodName: string;
  responseTime: number;
};

type LoggerConfig = {
  format: (data: FormatData) => string;
};

export function Log(config?: LoggerConfig): MethodDecorator {
  // ...rest of code here (hidden for brevity)

  const log = (responseTime: number) => {
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
@Log({
    format: ({ methodName, responseTime }) => `${methodName}=${responseTime}ms`,
})
async getItems() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return this.items;
}

@Log({ format: () => `adding items...` })
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

```bash
npm i winston
```

### Class Decorator

Create logger via Class decorator `logger.decorator.ts`

```ts
import winston, { LoggerOptions, format } from 'winston';

export function Logger(config?: LoggerOptions): ClassDecorator {
  const { combine, timestamp, colorize, printf } = format;

  return (target: any) => {
    const className = target.name;

    const mergedConfig: LoggerOptions = {
      level: 'info',
      format: combine(
        colorize(),
        timestamp(),
        printf(({ level, message, timestamp, className }) => {
          return `${timestamp} [${level}] \t[${className}] ${message}`;
        }),
      ),
      transports: [new winston.transports.Console()],
      defaultMeta: {
        className,
      },
      ...config, // merge optional config
    };

    const logger = winston.createLogger(mergedConfig);

    target.prototype.logger = logger;
  };
}
```

### Method Decorator

Call the winston logger instance via method decorator `log.decorator.ts`

```ts
import winston from 'winston';

type WithLogger = {
  logger: winston.Logger;
};

type FormatData = {
  className: string;
  methodName: string;
  responseTime: number;
};

type LogConfig = {
  format: (data: FormatData) => string;
};

export function Log(config?: LogConfig): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;
    const className = target.constructor.name; // Get the class name
    const isAwaiter = /__awaiter/.test(originalMethod.toString());

    const __log = (message: string, logger?: winston.Logger) => {
      if (logger) {
        logger.info(message);
      } else {
        console.log(message);
      }
    };

    const log = (responseTime: number, logger: winston.Logger) => {
      // Default format
      if (!config || !config.format) {
        __log(
          `[Class] ${className} [Method] ${String(
            propertyKey,
          )} took ${responseTime}ms`,
          logger,
        );

        return;
      }

      // Custom format
      const custom = config.format({
        className,
        methodName: String(propertyKey),
        responseTime,
      });

      __log(custom, logger);
    };

    // * ASYNC Function
    if (isAwaiter) {
      descriptor.value = async function (...args: unknown[]) {
        const startTime = Date.now();
        const result = await originalMethod.apply(this, args);
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        log(responseTime, (this as WithLogger).logger);

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

        log(responseTime, (this as WithLogger).logger);

        return result;
      };
    }

    return descriptor;
  };
}
```

### Usage

`index.ts`

```ts
import { Log, Logger } from './decorators';

@Logger()
class FruitManager {
  private items: string[] = [];

  @Log()
  async getItems() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return this.items;
  }

  @Log()
  addItems(...fruits: string[]) {
    this.items.push(...fruits);
  }
}

const manager = new FruitManager();

manager.addItems('apple', 'banana', 'cherry', 'lemon');
manager.getItems().then(console.log);
```

**Output**

```bash
2024-03-13T03:39:23.516Z [info]         [FruitManager] [Class] FruitManager [Method] addItems took 0ms
2024-03-13T03:39:26.527Z [info]         [FruitManager] [Class] FruitManager [Method] getItems took 3008ms
[ 'apple', 'banana', 'cherry', 'lemon' ]
```
