import { Transaction, KeywordPair, LedgerEntry, LedgerSummary, AccountBalance } from "./types.js";

// #made by chhavi :)
/**
 * Auto-categorizes a description against keywords.
 * Rule: Match the LONGEST/most specific keyword first (not array order).
 */
export function categorizeDescription(desc: string, keywords: KeywordPair[]): string {
  if (!desc || !keywords || keywords.length === 0) return "General";

  const cleanDesc = desc.trim().toLowerCase();
  
  // Sort keywords by length descending
  const sorted = [...keywords].sort((a, b) => b[0].length - a[0].length);

  for (const [kw, category] of sorted) {
    if (kw && cleanDesc.includes(kw.toLowerCase())) {
      return category;
    }
  }

  return "General";
}

/**
 * Double-entry ledger calculation engine.
 * Computes balanced entries for every transaction, sum of debits & credits, and account balances.
 */
export function computeLedger(transactions: Transaction[]): LedgerSummary {
  const entries: LedgerEntry[] = [];
  const accountTotals: Record<string, { debits: number; credits: number }> = {};

  const ensureAccount = (acc: string) => {
    if (!accountTotals[acc]) {
      accountTotals[acc] = { debits: 0, credits: 0 };
    }
  };

  for (const tx of transactions) {
    const amt = Number(tx.amount) || 0;
    const cat = tx.category || "General";
    const expenseAcc = `Expense:${cat}`;

    if (tx.whose === "Mine") {
      // "Mine" expense: Debit Expense:{category}, Credit Cash
      entries.push({
        transactionId: tx.id,
        account: expenseAcc,
        type: "Debit",
        amount: amt,
        memo: tx.desc,
        date: tx.date,
      });
      entries.push({
        transactionId: tx.id,
        account: "Cash",
        type: "Credit",
        amount: amt,
        memo: tx.desc,
        date: tx.date,
      });

      ensureAccount(expenseAcc);
      ensureAccount("Cash");
      accountTotals[expenseAcc].debits += amt;
      accountTotals["Cash"].credits += amt;

    } else if (tx.whose === "Roommate") {
      // "Roommate" fronted expense: Debit Roommate Receivable, Credit Cash
      entries.push({
        transactionId: tx.id,
        account: "Roommate Receivable",
        type: "Debit",
        amount: amt,
        memo: `[Roommate Fronted] ${tx.desc}`,
        date: tx.date,
      });
      entries.push({
        transactionId: tx.id,
        account: "Cash",
        type: "Credit",
        amount: amt,
        memo: `[Roommate Fronted] ${tx.desc}`,
        date: tx.date,
      });

      ensureAccount("Roommate Receivable");
      ensureAccount("Cash");
      accountTotals["Roommate Receivable"].debits += amt;
      accountTotals["Cash"].credits += amt;

      // Reimbursement: Debit Cash, Credit Roommate Receivable (reverses above)
      if (tx.reimbursed) {
        entries.push({
          transactionId: tx.id,
          account: "Cash",
          type: "Debit",
          amount: amt,
          memo: `[Reimbursement Received] ${tx.desc}`,
          date: tx.date,
        });
        entries.push({
          transactionId: tx.id,
          account: "Roommate Receivable",
          type: "Credit",
          amount: amt,
          memo: `[Reimbursement Settled] ${tx.desc}`,
          date: tx.date,
        });

        accountTotals["Cash"].debits += amt;
        accountTotals["Roommate Receivable"].credits += amt;
      }
    }
  }

  let totalDebits = 0;
  let totalCredits = 0;
  const accounts: Record<string, AccountBalance> = {};

  for (const [acc, totals] of Object.entries(accountTotals)) {
    totalDebits += totals.debits;
    totalCredits += totals.credits;
    accounts[acc] = {
      account: acc,
      debitTotal: totals.debits,
      creditTotal: totals.credits,
      netBalance: totals.debits - totals.credits,
    };
  }

  // Floating point equality check within 0.001
  const balanced = Math.abs(totalDebits - totalCredits) < 0.001;

  // Stats computation
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  let totalSpentMine = 0;
  let thisMonthMine = 0;
  let frontedRoommate = 0;
  let amountOwedByRoommate = 0;

  for (const tx of transactions) {
    const amt = Number(tx.amount) || 0;
    if (tx.whose === "Mine") {
      totalSpentMine += amt;
      if (tx.date.startsWith(currentMonthStr)) {
        thisMonthMine += amt;
      }
    } else if (tx.whose === "Roommate") {
      frontedRoommate += amt;
      if (!tx.reimbursed) {
        amountOwedByRoommate += amt;
      }
    }
  }

  return {
    totalDebits: Math.round(totalDebits * 100) / 100,
    totalCredits: Math.round(totalCredits * 100) / 100,
    balanced,
    accounts,
    entries,
    stats: {
      totalSpentMine: Math.round(totalSpentMine * 100) / 100,
      thisMonthMine: Math.round(thisMonthMine * 100) / 100,
      frontedRoommate: Math.round(frontedRoommate * 100) / 100,
      amountOwedByRoommate: Math.round(amountOwedByRoommate * 100) / 100,
    },
  };
}
