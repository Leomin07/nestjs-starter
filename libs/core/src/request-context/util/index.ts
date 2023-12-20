import { plainToClass } from 'class-transformer';
import { RequestContext } from '../request-context.dto';
import { IRequest } from '../interface';
import {
  REQUEST_ID_TOKEN_HEADER,
  FORWARDED_FOR_TOKEN_HEADER,
} from '@libs/core/constants';
import { UserAccessTokenClaims } from '@libs/core/types';

// Creates a RequestContext object from Request
export function createRequestContext(request: IRequest): RequestContext {
  const ctx = new RequestContext();
  ctx.requestID = request.header(REQUEST_ID_TOKEN_HEADER);
  ctx.url = request.url;
  ctx.ip = request.header(FORWARDED_FOR_TOKEN_HEADER)
    ? request.header(FORWARDED_FOR_TOKEN_HEADER)
    : request.ip;

  // If request.user does not exist, we explicitly set it to null.
  ctx.user = request.user
    ? plainToClass(UserAccessTokenClaims, (request as any)?.user, {
        excludeExtraneousValues: true,
      })
    : null;

  return ctx;
}
