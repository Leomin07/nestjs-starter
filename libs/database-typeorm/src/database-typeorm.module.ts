import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          type: 'mysql',
          host: process.env.MYSQL_HOST,
          port: Number(process.env.MYSQL_PORT),
          username: process.env.MYSQL_USERNAME,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          synchronize: false,
          entities: [User],
          logging: process.env.NODE_ENV !== 'production',
        };
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseTypeormModule {}
