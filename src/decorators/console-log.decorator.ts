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
