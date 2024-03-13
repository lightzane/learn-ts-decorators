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
