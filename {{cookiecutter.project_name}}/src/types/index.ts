import { Expose } from 'class-transformer';

export class UserAccessTokenClaims {
  @Expose()
  id: number;

  @Expose()
  username: string;
}
