import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { join } from 'path';

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    // ✅ Write errors to app.log
    new winston.transports.File({
      filename: join(process.cwd(), 'logs/app.log'),
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),

    // ✅ Console (dev only – optional)
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});
