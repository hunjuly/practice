import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Authentication } from "./entity/Auth";
import { mig11658577555378 } from "./migration/1658577555378-mig1";
import { mig11658578285595 } from "./migration/1658578285595-mig1";
import { mig11658578665147 } from "./migration/1658578665147-mig1";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "practice.mysql",
  port: 3306,
  username: "root",
  password: "password",
  database: "test",
  synchronize: false,
  logging: false,
  entities: [User, Authentication],
  migrations: [mig11658578665147, mig11658577555378, mig11658578285595],
  subscribers: [],
});

// https://typeorm.io/using-cli
// npm run typeorm migration:generate -- ./src/migration/mig1 -d src/data-source.ts
// npm run typeorm migration:run -- -d src/data-source.ts
// 실행하면 한 번씩 revert한다
// npm run typeorm migration:revert -- -d src/data-source.ts
// npm run typeorm migration:show -- -d src/data-source.ts
