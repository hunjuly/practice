# practice

## Todo

1. session timeout env 추가
1. logstash, elastic search, kibana 적용
1. 테스트 상세하게
1. README 정리

## 설계

-   typeorm 관련 소스가 응집성을 갖도록 entity를 포함한 모든 파일들을 /typeorm에 모아놨다.

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
