# practice

## Todo

1. 테스트 상세하게
    1. auth 테스트 작성해야 한다.
1. auth/etc 정리 좀 하자
1. src/common -> src/utils 로 바꿔야 하나?
1. typeorm data-source nestjs factory로 만들 수 없나?
1. README 정리
1. logstash, elastic search, kibana 적용

## 설계

-   typeorm 관련 소스가 응집성을 갖도록 entity를 포함한 모든 파일들을 /typeorm에 모아놨다.

### Unit Test

-   fixture/sut/actual/expected/verify 순서로 구성했다.
-   변수명은 user/file 등 내용이 아니라 sut/fixture 등 역할에 따라 명명했다.
    unit test에서 의미 보다는 역할이 중요하다

## Debugging

-   test를 비롯한 모든 디버깅 모드(`node --inspect`)로 실행 중인 프로세스는 `.vscode/launch.json`의 `Attach`를 사용한다.
-   `.spec.ts`에 정의된 테스트는 `npm test`를 하지 말고 각 테스트 항목에서 run/debug를 클릭해서 실행한다.
    <img src="./docs/test-buttons.png" width="377" alt="" />

## Running

이 프로젝트에 필요한 기본 인프라는 아래 스크립트를 실행한다.

```bash
sh scripts/docker_infra_bootup.sh
sh scripts/memory_infra_bootup.sh
```

## Installation

```bash
$ npm install
```

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
