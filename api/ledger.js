// #made by chhavi :)

const DEFAULT_TRANSACTIONS = [
  {
    id: "tx-init-1",
    date: new Date().toISOString().split("T")[0],
    amount: 115,
    desc: "7-11 Pork Bento & Green Tea",
    whose: "Mine",
    category: "Dining Out",
    reimbursed: false,
    idempotencyKey: "init-key-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-init-2",
    date: new Date().toISOString().split("T")[0],
    amount: 180,
    desc: "Shilin night market boba & snacks",
    whose: "Roommate",
    category: "Dining Out",
    reimbursed: false,
    idempotencyKey: "init-key-2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-init-3",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    amount: 500,
    desc: "MRT EasyCard Top-Up",
    whose: "Mine",
    category: "Transport",
    reimbursed: false,
    idempotencyKey: "init-key-3",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-init-4",
    date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
    amount: 620,
    desc: "PX Mart Weekly Groceries (Shared)",
    whose: "Roommate",
    category: "Groceries",
    reimbursed: true,
    idempotencyKey: "init-key-4",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-init-5",
    date: new Date().toISOString().split("T")[0],
    amount: 85,
    desc: "Bubble tea at Xing Fu Tang",
    whose: "Mine",
    category: "Dining Out",
    reimbursed: false,
    idempotencyKey: "init-key-5",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-init-6",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    amount: 350,
    desc: "Din Tai Fung Xiao Long Bao",
    whose: "Roommate",
    category: "Dining Out",
    reimbursed: false,
    idempotencyKey: "init-key-6",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-init-7",
    date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
    amount: 120,
    desc: "YouBike rental to NTU",
    whose: "Mine",
    category: "Transport",
    reimbursed: false,
    idempotencyKey: "init-key-7",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-init-8",
    date: new Date().toISOString().split("T")[0],
    amount: 2500,
    desc: "Semester tuition payment",
    whose: "Mine",
    category: "Education",
    reimbursed: false,
    idempotencyKey: "init-key-8",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-init-9",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    amount: 180,
    desc: "FamilyMart convenience store dinner",
    whose: "Roommate",
    category: "Dining Out",
    reimbursed: true,
    idempotencyKey: "init-key-9",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-init-10",
    date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
    amount: 450,
    desc: "Electricity bill for apartment",
    whose: "Mine",
    category: "Utilities",
    reimbursed: false,
    idempotencyKey: "init-key-10",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-init-11",
    date: new Date().toISOString().split("T")[0],
    amount: 500,
    desc: "Taiwan High Speed Rail ticket",
    whose: "Roommate",
    category: "Transport",
    reimbursed: false,
    idempotencyKey: "init-key-11",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx-init-12",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    amount: 890,
    desc: "Textbooks for economics course",
    whose: "Mine",
    category: "Education",
    reimbursed: false,
    idempotencyKey: "init-key-12",
    createdAt: new Date().toISOString(),
  },
];

let transactions = [...DEFAULT_TRANSACTIONS];

function computeLedger(txs) {
  const entries = [];
  const accountTotals = {};

  const ensureAccount = (acc) => {
    if (!accountTotals[acc]) {
      accountTotals[acc] = { debits: 0, credits: 0 };
    }
  };

  for (const tx of txs) {
    const amt = Number(tx.amount) || 0;
    const cat = tx.category || "General";
    const expenseAcc = `Expense:${cat}`;

    if (tx.whose === "Mine") {
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
  const accounts = {};

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

  const balanced = Math.abs(totalDebits - totalCredits) < 0.001;

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  let totalSpentMine = 0;
  let thisMonthMine = 0;
  let frontedRoommate = 0;
  let amountOwedByRoommate = 0;

  for (const tx of txs) {
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

export default function handler(req, res) {
  if (req.method === 'GET') {
    const ledger = computeLedger(transactions);
    res.status(200).json(ledger);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
