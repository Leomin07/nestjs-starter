import { applyDecorators, Controller, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

export function CustomController(name: string) {
  return applyDecorators(ApiTags(name), Controller(name));
}

export const CustomPost = (name: string, body: any, response?: any) => {
  return applyDecorators(
    Post(name),
    ApiCreatedResponse({ description: 'Success', type: response }),
    ApiBody({ type: body }),
    ApiConsumes('application/json'),
    ApiResponse({
      status: 200,
      schema: {
        $ref: getSchemaPath(body),
      },
    }),
  );
};

export const CustomPut = (name: string, body?: any, response?: any) => {
  return applyDecorators(
    Put(name),
    ApiCreatedResponse({ description: 'Success', type: response }),
    ApiBody({ type: body }),
    ApiConsumes('application/json'),
    ApiResponse({
      status: 200,
      schema: {
        $ref: getSchemaPath(body),
      },
    }),
  );
};
