import { Environment } from './enum';

export interface IConfigOneSignal {
  restKey: string;
  appId: string;
}

export interface IConfig {
  env: Environment;
  port: number;
  auth: IConfigAuth;
  //   typeORMOptions: typeof dataSource;
  queue: IConfigQueue;
  appName: string;
  oneSignal: IConfigOneSignal;
}

export interface IConfigAuth {
  secretOrKey: string;
  accessTokenExpiredIn: string;
  refreshTokenExpiredIn: string;
}

export interface IConfigQueue {
  host: string;
  port: number;
  prefix: string;
}
