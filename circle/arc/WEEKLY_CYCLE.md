# Arc Daily Cycle

Run this before a daily activity pass:

```powershell
cd C:\Users\Nexus\Documents\Circle
npm.cmd run cycle:prepare
npm.cmd run start-deployer
```

Keep the server window open, then follow the printed checklist.

The checklist changes slightly by date. It rotates small amounts, swap direction, bridge destination, issued token, and Dev Wallet amount.

Fast order:

1. App Kit Send: send the printed USDC amount to the Circle Dev Wallet.
2. App Kit Swap: use the printed token pair and amount with the `KIT_KEY` pasted in the page.
3. App Kit Bridge: bridge the printed USDC amount to the printed testnet destination.
4. Unified Balance: deposit and spend the printed amounts.
   For Arc Testnet to Arc Testnet spend, leave `useForwarder` unchecked.
5. Issued Token Transfer: use the printed ARCP or SKIPIO preset and amount.
6. Dev Wallet Transfer: run the printed command, which sets the daily amount for that one run.

After each step, save the `txHash` or ArcScan explorer link.

To preview a different date:

```powershell
$env:CYCLE_DATE="2026-07-03"; npm.cmd run cycle:today; Remove-Item Env:\CYCLE_DATE
```
