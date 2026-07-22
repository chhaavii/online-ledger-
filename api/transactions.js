// #made by chhavi :)

const DEFAULT_KEYWORDS = [
  ["7-11", "Groceries"],
  ["7-Eleven", "Groceries"],
  ["FamilyMart", "Groceries"],
  ["全家", "Groceries"],
  ["PX Mart", "Groceries"],
  ["全聯", "Groceries"],
  ["night market", "Dining Out"],
  ["夜市", "Dining Out"],
  ["market", "Groceries"],
  ["bubble tea", "Dining Out"],
  ["boba", "Dining Out"],
  ["珍奶", "Dining Out"],
  ["din tai fung", "Dining Out"],
  ["bento", "Dining Out"],
  ["便當", "Dining Out"],
  ["MRT", "Transport"],
  ["捷運", "Transport"],
  ["YouBike", "Transport"],
  ["Bus", "Transport"],
  ["公車", "Transport"],
  ["tuition", "Education"],
  ["textbook", "Education"],
  ["books", "Education"],
  ["Dorm", "Housing"],
  ["Rent", "Housing"],
  ["electricity", "Utilities"],
  ["water bill", "Utilities"],
  ["SIM card", "Telecom"],
];

const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];

const DEFAULT_TRANSACTIONS = [
  {
    id: "tx-init-1",
    date: today,
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
    date: today,
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
    date: yesterday,
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
    date: threeDaysAgo,
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
    date: today,
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
    date: yesterday,
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
    date: threeDaysAgo,
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
    date: today,
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
    date: yesterday,
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
    date: threeDaysAgo,
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
    date: today,
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
    date: yesterday,
    amount: 890,
    desc: "Textbooks for economics course",
    whose: "Mine",
    category: "Education",
    reimbursed: false,
    idempotencyKey: "init-key-12",
    createdAt: new Date().toISOString(),
  },
];

// In-memory storage for Vercel serverless
let transactions = [...DEFAULT_TRANSACTIONS];
let keywords = [...DEFAULT_KEYWORDS];
let idempotencyKeys = {};

// Initialize idempotency keys
DEFAULT_TRANSACTIONS.forEach(tx => {
  idempotencyKeys[tx.idempotencyKey] = tx.id;
});

function categorizeDescription(desc, keywords) {
  if (!desc || !keywords || keywords.length === 0) return "General";
  const cleanDesc = desc.trim().toLowerCase();
  const sorted = [...keywords].sort((a, b) => b[0].length - a[0].length);
  for (const [kw, category] of sorted) {
    if (kw && cleanDesc.includes(kw.toLowerCase())) {
      return category;
    }
  }
  return "General";
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(transactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  } else if (req.method === 'POST') {
    const { date, amount, desc, whose, category, idempotencyKey } = req.body;

    if (!desc || amount === undefined || !whose) {
      return res.status(400).json({ error: "Missing required fields: desc, amount, whose" });
    }

    const key = idempotencyKey || `req-${Date.now()}-${Math.random()}`;
    
    if (idempotencyKeys[key]) {
      return res.status(200).json({ duplicate: true, transaction: transactions.find(t => t.id === idempotencyKeys[key]) });
    }

    const newTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date,
      amount: Number(amount),
      desc,
      whose,
      category: category || categorizeDescription(desc, keywords),
      reimbursed: false,
      idempotencyKey: key,
      createdAt: new Date().toISOString(),
    };

    transactions.push(newTransaction);
    idempotencyKeys[key] = newTransaction.id;

    res.status(201).json({ transaction: newTransaction, duplicate: false });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
