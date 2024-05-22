import { MongoId } from 'src/helpers/common.type';
import { TokenType, UserType } from 'src/helpers/enum';

export interface ITokenPayload {
  _id: MongoId;
  userType: UserType;
  tokenType?: TokenType;
  [key: string]: any;
}
