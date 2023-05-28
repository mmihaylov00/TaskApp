import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import configuration from './src/config/configuration';

dotenv.config();

export const options: any = {
  type: 'postgres',
  host: configuration().db.host,
  port: configuration().db.port,
  username: configuration().db.username,
  password: configuration().db.password,
  database: configuration().db.database_name,
  synchronize: configuration().db.synchronize,
  logging: true,
  entities: [
    configuration().db.entities
  ],
  migrations: [
    configuration().db.migrations
  ],
}
const config = new DataSource(options);

export default config;
