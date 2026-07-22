export type Whose = "Mine" | "Roommate";

// #made by chhavi :)
export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  desc: string;
  whose: Whose;
  category: string;
  reimbursed: boolean;
  idempotencyKey: string;
  createdAt: string; // ISO timestamp
}

export type KeywordPair = [string, string]; // [keyword, category]

export interface LedgerEntry {
  transactionId: string;
  account: string;
  type: "Debit" | "Credit";
  amount: number;
  memo: string;
  date: string;
}

export interface AccountBalance {
  account: string;
  debitTotal: number;
  creditTotal: number;
  netBalance: number; // Debit - Credit
}

export interface LedgerSummary {
  totalDebits: number;
  totalCredits: number;
  balanced: boolean;
  accounts: Record<string, AccountBalance>;
  entries: LedgerEntry[];
  stats: {
    totalSpentMine: number;
    thisMonthMine: number;
    frontedRoommate: number;
    amountOwedByRoommate: number;
  };
}
