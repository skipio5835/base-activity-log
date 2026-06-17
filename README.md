# Base Activity Log

Base 체인 활동과 토큰 배포를 준비하기 위한 Node.js/TypeScript 작업 공간입니다. 중심 작업은 Base Sepolia 또는 Base Mainnet에 ERC-20 토큰을 배포하고, 이후 Base 생태계 활동 기록에 쓸 컨트랙트/스크립트를 관리하는 것입니다.

Circle Arc 관련 코드는 참고용으로 함께 보관합니다.

## 주요 구성

- `contracts/BaseActivityToken.sol`: Base 배포용 ERC-20 컨트랙트
- `scripts/deploy-base-token.ts`: Base Sepolia/Mainnet 배포 스크립트
- `contracts/Skipio.sol`, `contracts/ProofToken.sol`: 기존 Arc 테스트용 ERC-20 컨트랙트
- `scripts/*`: Circle Arc, App Kit, 검증, 배포 보조 스크립트

## Base 토큰 컨트랙트

`BaseActivityToken`은 OpenZeppelin 기반 ERC-20입니다.

- ERC-20 기본 전송/잔액 기능
- burn 지원
- EIP-2612 permit 지원
- owner-only mint
- `maxSupply` 상한

초기 공급량은 배포 시 owner에게 mint됩니다. 추가 mint는 owner만 할 수 있으며 `maxSupply`를 넘을 수 없습니다.

## 준비

의존성을 설치합니다.

```bash
npm install
```

`.env.example`을 `.env`로 복사한 뒤 Base 배포 값을 채웁니다. 실제 개인키는 `.env`에만 보관하고 커밋하지 않습니다.

```dotenv
BASE_NETWORK=base-sepolia
BASE_RPC_URL=
BASE_DEPLOYER_PRIVATE_KEY=
BASE_TOKEN_NAME=Base Activity Log
BASE_TOKEN_SYMBOL=BALOG
BASE_TOKEN_INITIAL_SUPPLY=1000000
BASE_TOKEN_MAX_SUPPLY=1000000
BASE_TOKEN_OWNER=
```

`BASE_NETWORK`는 다음 값을 지원합니다.

| Network | Chain ID | Default RPC | Explorer |
| --- | ---: | --- | --- |
| `base-sepolia` | `84532` | `https://sepolia.base.org` | `https://sepolia-explorer.base.org` |
| `base-mainnet` | `8453` | `https://mainnet.base.org` | `https://base.blockscout.com` |

`BASE_RPC_URL`을 비워두면 위 기본 RPC를 사용합니다. 운영/메인넷 배포에서는 전용 RPC를 쓰는 편이 좋습니다.

## Base 배포

먼저 컴파일과 타입 체크를 확인합니다.

```bash
npm run typecheck
npm run compile-custom
```

Base Sepolia에 배포합니다.

```bash
npm run deploy-base-token
```

Base Mainnet에 배포하려면 `.env`에서 네트워크를 바꿉니다.

```dotenv
BASE_NETWORK=base-mainnet
```

배포 스크립트는 연결된 RPC의 chain id가 선택한 Base 네트워크와 맞는지 확인한 뒤 배포합니다. 결과에는 contract address, explorer link, deploy tx, owner, supply 정보가 출력됩니다.

Base 공식 네트워크 정보: https://docs.base.org/base-chain/quickstart/connecting-to-base

## 민감 정보 관리

커밋하지 않는 파일과 폴더:

- `.env`
- `node_modules/`
- `artifacts/`
- `public/artifacts/`
- `recovery/`

개인키, Circle API key, entity secret, recovery file은 로컬에만 둡니다. 채팅이나 README, 커밋 메시지에 붙여넣지 않습니다.

## Circle Arc 참고 도구

이 repo에는 Circle Arc Testnet 작업용 스크립트도 함께 들어 있습니다. Base 작업과 별개로 Arc 테스트넷에 Circle Contracts 템플릿을 배포하거나 Circle App Kit 기능을 확인할 때 사용합니다.

Circle Developer Console에서 Standard API Key와 Entity Secret을 준비한 뒤 `.env`에 값을 채웁니다.

```dotenv
CIRCLE_API_KEY=...
CIRCLE_ENTITY_SECRET=...
CIRCLE_WEB3_API_KEY=...
```

Entity Secret 생성과 등록:

```bash
npm run generate-entity-secret
npm run register-entity-secret
```

Arc Testnet용 Dev-Controlled SCA wallet 생성:

```bash
npm run create-wallet
```

Circle Contracts 템플릿 배포:

```bash
npm run deploy-erc20
npm run deploy-erc721
npm run deploy-erc1155
npm run deploy-airdrop
```

상태 확인:

```bash
npm run check-transaction
npm run get-contract
```

Arc 참고 문서: https://docs.arc.io/build
