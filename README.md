# Base and Circle Activity

Base 작업과 Circle/Arc Testnet 작업을 한 저장소에서 분리해 관리하는 프로젝트입니다.

## Structure

- `base/`: Base 토큰 컨트랙트와 배포 스크립트
- `circle/arc/`: Circle Arc Testnet 컨트랙트, App Kit UI, 배포/검증 스크립트
- `shared/`: 공통 설정과 환경 변수 helper

## Commands

```bash
npm install
npm run typecheck
npm run compile-custom
npm run start-deployer
```

Base 배포는 `npm run deploy-base-token`, Circle Contracts/App Kit 작업은 `circle/arc` 아래 스크립트와 UI를 사용합니다.

Secrets are stored only in local `.env` and are never committed.
