import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`[${req.method}]: ${req.originalUrl}`);

    (async () => {
      try {
        const str = JSON.stringify(req.body);

        if (str.length < 2000) {
          this.logger.log(str);
        } else {
          this.logger.log('Body too large');
        }
      } catch (error) {}
    })();
    next();
  }
}
