export enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
  Test = 'test',
}

export enum NotificationTargetType {
  COMMON = 1,
  ALL = 2,
}

export enum ReadNotification {
  UNREAD = 0,
  READ = 1,
}

export enum ErrorCode {
  Unknown_Error = 'Unknown_Error',
  Invalid_Input = 'Invalid_Input',
  Not_Found = 'Not_Found',
  Token_Not_Exist = 'Token_Not_Exist',
  Forbidden_Resource = 'Forbidden_Resource',
  Unauthorized = 'Unauthorized',
  Too_Many_Requests = 'Too_Many_Requests',
  Permission_Denied = 'Permission_Denied',
  Register_Token_Expired = 'Register_Token_Expired',
  Phone_Already_Exists = 'Phone_Already_Exists',
  Code_Already_Exists = 'Code_Already_Exists',
  Change_Phone_Number_Code_Invalid = 'Change_Phone_Number_Code_Invalid',
  Your_Are_Change_To_Shame_Phone_Number = 'Your_Are_Change_To_Shame_Phone_Number',
  Phone_Not_Exists = 'Phone_Not_Exists',
  Maximum_Retry_Verification_Code = 'Maximum_Retry_Verification_Code',
  Delay_Between_Retry_Required = 'Delay_Between_Retry_Required',
  Verification_Code_Invalid = 'Verification_Code_Invalid',
  The_Allowed_Number_Of_Calls_Has_Been_Exceeded = 'The_Allowed_Number_Of_Calls_Has_Been_Exceeded',
}

export enum ErrorMessage {
  Unknown_Error = 'Unknown_Error',
  Invalid_Input = 'Invalid_Input',
  Not_Found = 'Not_Found',
  Token_Not_Exist = 'Token_Not_Exist',
  Forbidden_Resource = 'Forbidden_Resource',
  Unauthorized = 'Unauthorized',
  Too_Many_Requests = 'Too_Many_Requests',
  Permission_Denied = 'Permission_Denied',
  Register_Token_Expired = 'Register_Token_Expired',
  Phone_Already_Exists = 'Phone_Already_Exists',
  Code_Already_Exists = 'Code_Already_Exists',
  Change_Phone_Number_Code_Invalid = 'Change_Phone_Number_Code_Invalid',
  Your_Are_Change_To_Shame_Phone_Number = 'Your_Are_Change_To_Shame_Phone_Number',
  Phone_Not_Exists = 'Phone_Not_Exists',
  Maximum_Retry_Verification_Code = 'Maximum_Retry_Verification_Code',
  Delay_Between_Retry_Required = 'Delay_Between_Retry_Required',
  Verification_Code_Invalid = 'Verification_Code_Invalid',
  The_Allowed_Number_Of_Calls_Has_Been_Exceeded = 'The_Allowed_Number_Of_Calls_Has_Been_Exceeded',
}

export enum UserType {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum TokenType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  REGISTER_TOKEN = 'REGISTER_TOKEN',
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum CommonStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  NOT_VERIFY = 2,
  REJECTED = 3,
  TERMINATED = 4,
}

export enum VerificationCodeType {
  REGISTER = 1,
  LOGIN = 2,
  CHANGE_PHONE_NUMBER = 3,
}

export enum VerificationCodeStatus {
  ACTIVE = 1,
  USED = 2,
  INACTIVE = 0,
}

export enum Gender {
  MALE = 1,
  FEMALE = 2,
  ALL = 3,
}

export enum MemberStatus {
  ACTIVE = 1,
  BLOCKED = 0,
  SUSPEND = 2,
}
