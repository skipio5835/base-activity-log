# Arc Daily Cycle

Run this before a daily activity pass:

```powershell
cd C:\Users\Nexus\Documents\Circle
npm.cmd run cycle:prepare
npm.cmd run start-deployer
```

Keep the server window open, then follow the printed checklist.

If port `4173` is already serving a page without `/api/arcinvoice`, run the app on
another port and print the checklist with the same port:

```powershell
$env:PORT="4174"; npm.cmd run cycle:today
$env:PORT="4174"; npm.cmd run start-deployer
```

The checklist changes slightly by date. It rotates small amounts, swap direction, bridge destination, raw CCTP destination, issued token, Dev Wallet amount, memo receipt amount, batch payout rows, ArcInvoice amount, token allowance amount, delegated transfer amount, ArcEscrow amount, escrow settlement outcome, and ArcSubscription price/cadence.

Fast order:

1. App Kit Send: send the printed USDC amount to the Circle Dev Wallet.
2. App Kit Swap: use the printed token pair and amount with the `KIT_KEY` pasted in the page.
3. App Kit Bridge: bridge the printed USDC amount to the printed testnet destination.
4. Unified Balance: deposit and spend the printed amounts.
   For Arc Testnet to Arc Testnet spend, leave `useForwarder` unchecked.
5. Issued Token Transfer: use the printed ARCP or SKIPIO preset and amount.
6. Dev Wallet Transfer: run the printed command, which sets the daily amount for that one run.
7. Memo Receipt: open Arc Payment Ops and send the printed receipt through `Memo.memo`.
8. Batch Payout: use Arc Payment Ops to submit the printed rows through `Multicall3From.aggregate3`.
9. ArcInvoice Register: create a new invoice, use the printed contract, then register it on Arc.
10. ArcInvoice Payment: pay the registered invoice with the printed native USDC amount.
11. ArcInvoice Cancel: create a separate unpaid invoice, register it, then cancel it.
12. Issued Token Approve: approve the printed spender for the printed ARCP or SKIPIO amount.
13. Dev Wallet transferFrom: run the printed command so the Circle Dev Wallet spends part of the allowance.
14. Issued Token Revoke: revoke the same spender by approving `0`.
15. ArcEscrow Fund: create a draft, fund it with native USDC, and save the funding tx.
16. ArcEscrow Settle: release or refund the funded escrow according to the printed outcome.
17. ArcSubscription Plan: create a native-USDC subscription plan.
18. ArcSubscription Subscribe: pay for the printed number of cycles.
19. ArcSubscription Cancel: cancel the active subscription.
20. Raw CCTP Approve: approve the Circle Bridge contract to burn the printed Arc ERC-20 USDC amount.
21. Raw CCTP Burn + Attestation: call `bridgeWithPreapproval`, then poll Iris for the attestation.
22. Raw CCTP Mint: switch to the printed destination and call `receiveMessage`.

Current ArcEscrow contract: `0x679b3456100a3102e81ba60b54a400443fe20558`.
Current ArcSubscription contract: `0x89b7bde935505992bf33f838359613ed9cdfaed0`.
Current CCTP Bridge contract: `0xC5567a5E3370d4DBfB0540025078e283e36A363d`.
Current CCTP V2 MessageTransmitter: `0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275`.

After each step, save the `txHash` or ArcScan explorer link.

To preview a different date:

```powershell
$env:CYCLE_DATE="2026-07-03"; npm.cmd run cycle:today; Remove-Item Env:\CYCLE_DATE
```
