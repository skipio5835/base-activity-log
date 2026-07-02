# Circle / Arc Workspace

This workspace contains Arc Testnet experiments, Circle App Kit pages, custom
Solidity contracts, and the hackathon MVP named ArcInvoice.

## ArcInvoice MVP

ArcInvoice is a small USDC invoice product for the Arc hackathon:

- Merchants create invoice records through a backend API.
- The invoice is registered on an Arc smart contract.
- Buyers pay native USDC on Arc.
- The app stores a receipt with tx hashes and ArcScan links.

See [circle/arc/ARCINVOICE.md](circle/arc/ARCINVOICE.md) for the architecture,
demo script, and submission notes.

## Structure

- `circle/arc/contracts/`: Arc Testnet Solidity contracts.
- `circle/arc/src/`: browser TypeScript entrypoints.
- `circle/arc/public/`: static app pages and browser bundles.
- `circle/arc/scripts/`: local server, compile scripts, and Circle helpers.
- `base/`: Base testnet token work.
- `shared/`: common config and helpers.

## Commands

```bash
npm install
npm run compile-custom
npm run build-arc-invoice
npm run typecheck
npm run start-deployer
```

Open `http://localhost:4173` after the server starts.

Secrets are stored only in local `.env` and are never committed.
