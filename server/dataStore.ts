import fs from "fs";
import path from "path";
// #made by chhavi :)
import crypto from "crypto";
import { Transaction, KeywordPair } from "../src/types.js";
import { categorizeDescription } from "../src/ledgerEngine.js";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

interface DBData {
  transactions: Transaction[];
  keywords: KeywordPair[];
  idempotencyKeys: Record<string, string>; // idempotencyKey -> transactionId
}

const DEFAULT_KEYWORDS: KeywordPair[] = [
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

const DEFAULT_TRANSACTIONS: Transaction[] = [
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

function initDB(): DBData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const data = JSON.parse(raw);
      return {
        transactions: data.transactions || DEFAULT_TRANSACTIONS,
        keywords: data.keywords || DEFAULT_KEYWORDS,
        idempotencyKeys: data.idempotencyKeys || {},
      };
    } catch (e) {
      console.error("Failed to read DB file, initializing default:", e);
    }
  }

  const initialData: DBData = {
    transactions: DEFAULT_TRANSACTIONS,
    keywords: DEFAULT_KEYWORDS,
    idempotencyKeys: {
      "init-key-1": "tx-init-1",
      "init-key-2": "tx-init-2",
      "init-key-3": "tx-init-3",
      "init-key-4": "tx-init-4",
      "init-key-5": "tx-init-5",
      "init-key-6": "tx-init-6",
      "init-key-7": "tx-init-7",
      "init-key-8": "tx-init-8",
      "init-key-9": "tx-init-9",
      "init-key-10": "tx-init-10",
      "init-key-11": "tx-init-11",
      "init-key-12": "tx-init-12",
    },
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  return initialData;
}

let db = initDB();

function saveDB() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (e) {
    console.error("Failed to save DB file:", e);
  }
}

export function getTransactions(): Transaction[] {
  return [...db.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getTransactionById(id: string): Transaction | undefined {
  return db.transactions.find((t) => t.id === id);
}

export function getTransactionByIdempotencyKey(key: string): Transaction | undefined {
  const txId = db.idempotencyKeys[key];
  if (!txId) return undefined;
  return db.transactions.find((t) => t.id === txId);
}

export function addTransaction(data: {
  date: string;
  amount: number;
  desc: string;
  whose: "Mine" | "Roommate";
  category?: string;
  idempotencyKey: string;
}): { transaction: Transaction; duplicate: boolean } {
  // Idempotency check
  if (data.idempotencyKey) {
    const existing = getTransactionByIdempotencyKey(data.idempotencyKey);
    if (existing) {
      return { transaction: existing, duplicate: true };
    }
  }

  const keywords = getKeywords();
  const category =
    data.category && data.category.trim() !== ""
      ? data.category.trim()
      : categorizeDescription(data.desc, keywords);

  const id = "tx-" + crypto.randomUUID();
  const newTx: Transaction = {
    id,
    date: data.date || new Date().toISOString().split("T")[0],
    amount: Number(data.amount) || 0,
    desc: data.desc.trim(),
    whose: data.whose,
    category,
    reimbursed: false,
    idempotencyKey: data.idempotencyKey,
    createdAt: new Date().toISOString(),
  };

  db.transactions.unshift(newTx);
  if (data.idempotencyKey) {
    db.idempotencyKeys[data.idempotencyKey] = id;
  }
  saveDB();

  return { transaction: newTx, duplicate: false };
}

export function updateTransaction(
  id: string,
  updates: Partial<Pick<Transaction, "reimbursed" | "category" | "desc">>
): Transaction | undefined {
  const tx = db.transactions.find((t) => t.id === id);
  if (!tx) return undefined;

  if (typeof updates.reimbursed === "boolean") {
    tx.reimbursed = updates.reimbursed;
  }
  if (updates.category) {
    tx.category = updates.category;
  }
  if (updates.desc) {
    tx.desc = updates.desc;
  }

  saveDB();
  return tx;
}

export function deleteTransaction(id: string): boolean {
  const idx = db.transactions.findIndex((t) => t.id === id);
  if (idx === -1) return false;

  const [removed] = db.transactions.splice(idx, 1);
  if (removed && removed.idempotencyKey) {
    delete db.idempotencyKeys[removed.idempotencyKey];
  }
  saveDB();
  return true;
}

export function getKeywords(): KeywordPair[] {
  return db.keywords;
}

export function setKeywords(newKeywords: KeywordPair[]): KeywordPair[] {
  db.keywords = newKeywords;
  saveDB();
  return db.keywords;
}
