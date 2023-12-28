import { LiteralObject } from '@nestjs/cache-manager';

export function substrContent(content: string, index: number) {
  return content.length > index ? content.substring(0, index) + '...' : content;
}

export function randomString(length = 8) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function randomOTP(length = 6): string {
  const digits = '0123456789';
  const digitsLength = digits.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * digitsLength);
    result += digits[index];
  }
  return result;
}

export function returnPaging(
  data: LiteralObject[],
  totalItems: number,
  params: LiteralObject,
  metadata = {},
) {
  const totalPages = Math.ceil(totalItems / params.pageSize);
  return {
    paging: true,
    hasMore: params.pageIndex < totalPages,
    pageIndex: params.pageIndex,
    totalPages: Math.ceil(totalItems / params.pageSize),
    totalItems,
    data,
    ...metadata,
  };
}

export function returnLoadMore(
  data: LiteralObject[],
  params: LiteralObject,
  metadata = {},
) {
  return {
    paging: true,
    hasMore: data.length === params.pageSize,
    data,
    pageSize: params.pageSize,
    ...metadata,
  };
}

export function assignLoadMore(params: LiteralObject) {
  params.pageSize = Number(params.pageSize) || 10;

  return params;
}

export function assignPaging(params: LiteralObject) {
  params.pageIndex = Number(params.pageIndex) || 1;
  params.pageSize = Number(params.pageSize) || 10;
  params.skip = (params.pageIndex - 1) * params.pageSize;

  return params;
}
