import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "practice.mysql",
  port: 3306,
  username: "root",
  password: "password",
  database: "test",
  synchronize: false,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
