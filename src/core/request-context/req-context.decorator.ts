import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestContext } from './request-context.dto';
import { createRequestContext } from './util';
import { IRequest } from './interface';

export const ReqContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestContext => {
    const request = ctx.switchToHttp().getRequest<IRequest>();

    return createRequestContext(request as any);
  },
);
