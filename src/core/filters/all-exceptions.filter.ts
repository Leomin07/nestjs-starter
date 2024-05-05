import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { REQUEST_ID_TOKEN_HEADER } from '../constants';
import { ErrorCode, ErrorMessage } from 'src/helpers/enum';
import { createRequestContext } from '../request-context/util';
import { AppLogger } from '../logger/logger.service';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  /** set logger context */
  constructor(
    private config: ConfigService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AllExceptionsFilter.name);
  }
  catch(exception: T, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const req: Request = ctx.getRequest<Request>();
    const res: Response = ctx.getResponse<Response>();

    const path = req.url;
    const timestamp = new Date().toISOString();
    const requestId = req.headers[REQUEST_ID_TOKEN_HEADER];
    const requestContext = createRequestContext(req);

    let stack: any;
    let statusCode: HttpStatus;
    let errorName: string;
    let errorMessage: string;
    let errorCode: string;
    // let details: string | Record<string, any>;
    let devMessage: string;
    // TODO : Based on language value in header, return a localized message.
    // const acceptedLanguage = 'en';
    let localizedMessage: string;

    // TODO : Refactor the below cases into a switch case and tidy up error response creation.
    if (exception instanceof HttpException) {
      const data = exception.getResponse() as any;

      if (data === 'ThrottlerException: Too Many Requests') {
        statusCode = exception.getStatus();
        errorName = exception.constructor.name;
        errorMessage =
          ErrorMessage.The_Allowed_Number_Of_Calls_Has_Been_Exceeded;
        errorCode = ErrorCode.The_Allowed_Number_Of_Calls_Has_Been_Exceeded;
        devMessage = 'Too Many Requests';
      } else if (data?.['message'] === 'Unauthorized') {
        statusCode = exception.getStatus();
        errorName = exception.constructor.name;
        errorMessage = ErrorMessage.Unauthorized;
        errorCode = ErrorCode.Unauthorized;
        devMessage = 'Unauthorized';
      } else if (data?.['error'] === 'Not Found') {
        statusCode = exception.getStatus();
        errorName = exception.constructor.name;
        errorMessage = ErrorMessage.Not_Found;
        errorCode = ErrorCode.Not_Found;
        devMessage = data?.['message'];
      } else if (data?.['error'] === 'Forbidden') {
        statusCode = exception.getStatus();
        errorName = exception.constructor.name;
        errorMessage = ErrorMessage.Forbidden_Resource;
        errorCode = ErrorCode.Forbidden_Resource;
        devMessage = data?.['message'];
      } else {
        statusCode = exception.getStatus();
        errorName = exception.constructor.name;
        errorMessage = exception?.['response']?.['errorMessage'];
        errorCode = exception?.['response']?.['errorCode'];
        devMessage = exception?.['response']?.['devMessage'];
      }
    } else if (exception instanceof Error) {
      errorName = exception.constructor.name;
      errorMessage = exception.message;
      errorCode = exception.message;
      stack = exception.stack;
    }

    // Set to internal server error in case it did not match above categories.
    statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    errorName = errorName || 'InternalException';
    errorCode = errorCode || 'Internal server error';
    errorMessage = errorMessage || 'Internal server error';
    devMessage = devMessage || null;

    // NOTE: For reference, please check https://cloud.google.com/apis/design/errors
    const error = {
      statusCode,
      errorCode,
      errorMessage,
      localizedMessage,
      errorName,
      // Additional meta added by us.
      path,
      requestId,
      timestamp,
      devMessage,
    };

    // this.loggers.error(error.message, stack, requestContext);
    this.logger.error(requestContext, error.errorMessage, {
      error,
      stack,
    });

    // Suppress original internal server error details in prod mode
    const isProMood = this.config.get<string>('NODE_ENV') !== 'development';
    if (isProMood && statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      error.errorCode = 'Internal server error';
      error.errorMessage = 'Internal server error';
    }

    res.status(statusCode).json({ error });
  }
}
