# nestjs

nestjs 테스트 프로젝트.

## Installation

```bash
$ npm install
```

## Debugging

-   npm start로 서비스를 시작하고 디버거를 연결하려면 `.vscode/launch.json`에 정의된 `Run npm start`를 실행한다
-   `.spec.ts`에 정의된 테스트는 `npm test`를 하지 말고 각 테스트 항목에서 run/debug를 클릭해서 실행한다.
-   test를 비롯한 모든 `node --inspect`로 실행 중인 프로세스는 `.vscode/launch.json`의 `Attach`를 사용한다..
-   `tasks.json`에 정의된 `npm run`은 편의를 위해서 정의했다.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
