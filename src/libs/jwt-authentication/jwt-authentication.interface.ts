import { TokenType, UserType } from 'src/helpers/enum';

export interface ITokenPayload {
  id: number;
  userType: UserType;
  tokenType?: TokenType;
  [key: string]: any;
}
