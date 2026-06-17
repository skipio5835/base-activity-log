# Arc Circle Contracts Deployment

Arc 문서의 Circle Contracts quickstart를 기반으로 Arc Testnet에 사전 감사 템플릿을 배포하는 Node.js/TypeScript 프로젝트입니다.

## 준비

1. Circle Developer Console에서 Standard API Key와 Entity Secret을 준비합니다.
2. `.env.example`을 `.env`로 복사하고 아래 값을 채웁니다.

```dotenv
CIRCLE_API_KEY=...
CIRCLE_ENTITY_SECRET=...
CIRCLE_WEB3_API_KEY=...
```

Entity Secret을 아직 만들지 않았다면:

```bash
npm run generate-entity-secret
```

출력된 값을 `.env`의 `CIRCLE_ENTITY_SECRET`에 저장한 뒤 Circle에 등록합니다.

```bash
npm run register-entity-secret
```

`recovery/`에 생성된 recovery file은 별도 안전한 곳에 보관하세요.

## 지갑 생성

Arc Testnet 배포용 Dev-Controlled SCA wallet을 생성합니다.

```bash
npm run create-wallet
```

출력의 `env.WALLET_ID`, `env.WALLET_ADDRESS` 값을 `.env`에 복사합니다.

## 템플릿 배포

```bash
npm run deploy-erc20
npm run deploy-erc721
npm run deploy-erc1155
npm run deploy-airdrop
```

배포 명령은 `ARC-TESTNET`에 `MEDIUM` fee level로 요청합니다. 배포 성공 응답은 실제 완료가 아니라 시작 상태이므로 출력의 `env.TRANSACTION_ID`와 `env.CONTRACT_ID`를 `.env`에 저장한 뒤 상태를 확인합니다.

```bash
npm run check-transaction
npm run get-contract
```

트랜잭션 완료까지 기다리고 싶으면 `.env`에 `WAIT_FOR_STATE=COMPLETE`를 추가한 뒤 `npm run check-transaction`을 실행합니다.

## Circle Contracts template IDs

| Template | Template ID |
| --- | --- |
| ERC-20 | `a1b74add-23e0-4712-88d1-6b3009e85a86` |
| ERC-721 | `76b83278-50e2-4006-8b63-5b1a2a814533` |
| ERC-1155 | `aea21da6-0aa2-4971-9a1a-5098842b1248` |
| Airdrop | `13e322f2-18dc-4f57-8eed-4bddfc50f85e` |

참고 문서: https://docs.arc.io/build

## Base 토큰 컨트랙트

Base 배포용 ERC-20 컨트랙트는 `contracts/BaseActivityToken.sol`입니다. OpenZeppelin 기반이며 기본 구성은 다음과 같습니다.

- ERC-20 + burn
- EIP-2612 permit
- owner-only mint
- `maxSupply` 상한

먼저 `.env`에 Base 배포용 값을 채웁니다. 실제 개인키는 `.env`에만 두고 커밋하지 않습니다.

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

`BASE_NETWORK`는 `base-sepolia` 또는 `base-mainnet`을 지원합니다. `BASE_RPC_URL`을 비워두면 공식 공개 RPC를 사용합니다.

```bash
npm run deploy-base-token
```

배포 스크립트는 RPC의 chain id가 선택한 Base 네트워크와 맞는지 확인한 뒤 배포합니다. 기본값은 Base Sepolia이며, Base 공식 네트워크 정보는 https://docs.base.org/base-chain/quickstart/connecting-to-base 를 기준으로 합니다.
