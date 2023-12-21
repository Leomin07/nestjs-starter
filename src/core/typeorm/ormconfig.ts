import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

// config env
// dotenv.config({
//   path: join(__dirname, '../../.env'),
// });

const dataSourceOptions = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  migrationsRun: true,
  entities: [],
  migrations: [],
  synchronize: false,
  logging: true,
} as DataSourceOptions);

export default dataSourceOptions;

dataSourceOptions
  .initialize()
  .then(() => console.log('Data Source has been initialized'))
  .catch((error) => console.error('Error initializing Data Source', error));
