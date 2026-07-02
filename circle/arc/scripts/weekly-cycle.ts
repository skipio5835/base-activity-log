const DEFAULT_METAMASK = "0x0000000000000000000000000000000000000000";
const DEFAULT_CIRCLE_WALLET = "0x78131700be4a8f2d16eeb0cba3498d2e717f2cd3";
const SKIPIO_CONTRACT = "0x724038D2B4c1EbE69DC8B29cc5d591C4caA21918";
const ARCP_CONTRACT = "0x7A30aad0AA76bF8D2C14B9Eef035C07EEFDcdA8f";
const USDC_ADDRESS = "0x3600000000000000000000000000000000000000";
const BASE_URL = `http://localhost:${process.env.PORT ?? "4173"}`;

const metamaskAddress = process.env.METAMASK_ADDRESS?.trim() || DEFAULT_METAMASK;
const circleWalletAddress = process.env.WALLET_ADDRESS?.trim() || DEFAULT_CIRCLE_WALLET;

type DailyPlan = {
  sendAmount: string;
  swapAmount: string;
  swapTokenIn: "USDC" | "EURC";
  swapTokenOut: "USDC" | "EURC";
  bridgeAmount: string;
  bridgeTo: "Ethereum_Sepolia" | "Base_Sepolia";
  unifiedDeposit: string;
  unifiedSpend: string;
  tokenPreset: "ARCP / ProofToken" | "SKIPIO";
  tokenAmount: string;
  devWalletAmount: string;
};

type Step = {
  title: string;
  url?: string;
  command?: string;
  fields: string[];
  proof: string;
};

const dailyPlans: DailyPlan[] = [
  {
    sendAmount: "0.007",
    swapAmount: "0.01",
    swapTokenIn: "USDC",
    swapTokenOut: "EURC",
    bridgeAmount: "0.05",
    bridgeTo: "Ethereum_Sepolia",
    unifiedDeposit: "0.05",
    unifiedSpend: "0.005",
    tokenPreset: "ARCP / ProofToken",
    tokenAmount: "1",
    devWalletAmount: "0.005",
  },
  {
    sendAmount: "0.009",
    swapAmount: "0.01",
    swapTokenIn: "EURC",
    swapTokenOut: "USDC",
    bridgeAmount: "0.06",
    bridgeTo: "Base_Sepolia",
    unifiedDeposit: "0.06",
    unifiedSpend: "0.006",
    tokenPreset: "SKIPIO",
    tokenAmount: "2",
    devWalletAmount: "0.006",
  },
  {
    sendAmount: "0.011",
    swapAmount: "0.015",
    swapTokenIn: "USDC",
    swapTokenOut: "EURC",
    bridgeAmount: "0.07",
    bridgeTo: "Ethereum_Sepolia",
    unifiedDeposit: "0.07",
    unifiedSpend: "0.007",
    tokenPreset: "ARCP / ProofToken",
    tokenAmount: "3",
    devWalletAmount: "0.007",
  },
  {
    sendAmount: "0.013",
    swapAmount: "0.015",
    swapTokenIn: "EURC",
    swapTokenOut: "USDC",
    bridgeAmount: "0.08",
    bridgeTo: "Base_Sepolia",
    unifiedDeposit: "0.08",
    unifiedSpend: "0.008",
    tokenPreset: "SKIPIO",
    tokenAmount: "1",
    devWalletAmount: "0.008",
  },
  {
    sendAmount: "0.015",
    swapAmount: "0.02",
    swapTokenIn: "USDC",
    swapTokenOut: "EURC",
    bridgeAmount: "0.09",
    bridgeTo: "Ethereum_Sepolia",
    unifiedDeposit: "0.09",
    unifiedSpend: "0.009",
    tokenPreset: "ARCP / ProofToken",
    tokenAmount: "2",
    devWalletAmount: "0.009",
  },
  {
    sendAmount: "0.017",
    swapAmount: "0.02",
    swapTokenIn: "EURC",
    swapTokenOut: "USDC",
    bridgeAmount: "0.10",
    bridgeTo: "Base_Sepolia",
    unifiedDeposit: "0.10",
    unifiedSpend: "0.01",
    tokenPreset: "SKIPIO",
    tokenAmount: "3",
    devWalletAmount: "0.01",
  },
  {
    sendAmount: "0.019",
    swapAmount: "0.012",
    swapTokenIn: "USDC",
    swapTokenOut: "EURC",
    bridgeAmount: "0.055",
    bridgeTo: "Ethereum_Sepolia",
    unifiedDeposit: "0.055",
    unifiedSpend: "0.0055",
    tokenPreset: "ARCP / ProofToken",
    tokenAmount: "5",
    devWalletAmount: "0.0055",
  },
];

function todayKey(): string {
  const override = process.env.CYCLE_DATE?.trim();
  if (override) {
    return override;
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Seoul",
    year: "numeric",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

function dayOfYear(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) {
    throw new Error("CYCLE_DATE must use YYYY-MM-DD format.");
  }

  const start = Date.UTC(year, 0, 1);
  const current = Date.UTC(year, month - 1, day);
  return Math.floor((current - start) / 86_400_000) + 1;
}

function devWalletCommand(amount: string): string {
  return `$env:DEV_WALLET_TRANSFER_AMOUNT="${amount}"; npm.cmd run dev-wallet-usdc-transfer; Remove-Item Env:\\DEV_WALLET_TRANSFER_AMOUNT`;
}

const cycleDate = todayKey();
const planIndex = (dayOfYear(cycleDate) - 1) % dailyPlans.length;
const plan = dailyPlans[planIndex];

const steps: Step[] = [
  {
    title: "1. App Kit Send",
    url: `${BASE_URL}/public/appkit-send.html`,
    fields: [
      `Recipient: ${circleWalletAddress}`,
      `Token: ${USDC_ADDRESS}`,
      `Amount: ${plan.sendAmount}`,
    ],
    proof: "Save txHash/explorer after MetaMask signs.",
  },
  {
    title: "2. App Kit Swap",
    url: `${BASE_URL}/public/appkit-swap.html?proxy=1`,
    fields: [
      "KIT_KEY: paste manually in the page. Do not save it in chat.",
      `Token in: ${plan.swapTokenIn}`,
      `Token out: ${plan.swapTokenOut}`,
      `Amount in: ${plan.swapAmount}`,
      "Fallback if balance/liquidity is short: USDC -> EURC, Amount in: 0.01",
    ],
    proof: "Save txHash/explorer after swap confirms.",
  },
  {
    title: "3. App Kit Bridge",
    url: `${BASE_URL}/public/appkit-bridge.html?proxy=1`,
    fields: [
      `Expected account: ${metamaskAddress}`,
      "From: Arc_Testnet",
      `To: ${plan.bridgeTo}`,
      `Recipient: ${metamaskAddress}`,
      `Amount: ${plan.bridgeAmount}`,
      "Forwarder: checked",
    ],
    proof: "Save burn/bridge txHash and explorer link.",
  },
  {
    title: "4. Unified Balance",
    url: `${BASE_URL}/public/appkit-unified-balance.html?proxy=1`,
    fields: [
      `Expected account: ${metamaskAddress}`,
      "Source chain: Arc_Testnet",
      "Destination chain: Arc_Testnet",
      `Deposit amount: ${plan.unifiedDeposit}`,
      `Spend amount: ${plan.unifiedSpend}`,
      `Recipient: ${metamaskAddress}`,
      "Allowance: approve",
      "Forwarder: unchecked for Arc_Testnet -> Arc_Testnet spend",
    ],
    proof: "Save deposit tx and spend tx.",
  },
  {
    title: "5. Issued Token Transfer",
    url: `${BASE_URL}/public/skipio-transfer.html`,
    fields: [
      `Token preset: ${plan.tokenPreset}`,
      `ARCP contract: ${ARCP_CONTRACT}`,
      `SKIPIO contract: ${SKIPIO_CONTRACT}`,
      `Recipient: ${circleWalletAddress}`,
      `Amount: ${plan.tokenAmount}`,
    ],
    proof: "Save txHash/explorer after MetaMask signs.",
  },
  {
    title: "6. Circle Dev Wallet Transfer",
    command: devWalletCommand(plan.devWalletAmount),
    fields: [
      `From: Circle Dev Wallet (${circleWalletAddress})`,
      `To: MetaMask (${metamaskAddress})`,
      "Token: Arc Testnet USDC",
      `Amount: ${plan.devWalletAmount}`,
    ],
    proof: "Save txHash/explorer from terminal output.",
  },
];

function printStep(step: Step): void {
  console.log(step.title);
  if (step.url) {
    console.log(`  URL: ${step.url}`);
  }
  if (step.command) {
    console.log(`  Command: ${step.command}`);
  }
  for (const field of step.fields) {
    console.log(`  - ${field}`);
  }
  console.log(`  Proof: ${step.proof}`);
  console.log("");
}

console.log("Arc daily cycle quick sheet");
console.log(`Date: ${cycleDate}`);
console.log(`Variant: ${planIndex + 1}/${dailyPlans.length}`);
console.log("Purpose: vary real feature usage with small, affordable amounts.");
console.log("Server: npm.cmd run start-deployer");
console.log(`ArcScan: https://testnet.arcscan.app/address/${metamaskAddress}`);
console.log("");

for (const step of steps) {
  printStep(step);
}

console.log("After each run, keep txHash/explorer links together in one note.");
