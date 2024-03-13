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
