import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorMessage } from 'src/helpers/enum';

export class BaseApiException extends HttpException {
  public details: string | Record<string, any>;

  constructor(
    message: ErrorMessage,
    devMessage?: string | any,
    status?: HttpStatus,
    details?: string | Record<string, any>,
  ) {
    // Calling parent constructor of base Exception class.
    const objError = { message, devMessage };
    if (devMessage) objError['devMessage'] = devMessage;

    super(objError, status);
    this.name = BaseApiException.name;
    this.details = details;
  }
}

export class Exception extends BaseApiException {
  public details: string | Record<string, any>;
  /**
   *
   * @example
   *
   *   throw Exception("Unknown_Error")
   *
   *   throw Exception("Unknown_Error", "This is error description")
   *
   *   throw Exception("Unknown_Error", "This is error description", HttpStatus.BAD_REQUEST)
   *
   *   throw Exception("Unknown_Error", "This is error description", HttpStatus.BAD_REQUEST, { isSystem: true })
   */
  constructor(
    message: ErrorMessage,
    devMessage?: string | any,
    status?: HttpStatus,
    details?: string | Record<string, any>,
  ) {
    super(message, devMessage, status);
    this.name = BaseApiException.name;
    this.details = details;
  }
}
