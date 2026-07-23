import crypto from "crypto";
import { Transaction, KeywordPair } from "../src/types.js";
import { categorizeDescription } from "../src/ledgerEngine.js";
import { prisma } from "./prisma.js";

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

const DEFAULT_TRANSACTIONS = [
  { date: today, amount: 115, desc: "7-11 Pork Bento & Green Tea", whose: "Mine", category: "Dining Out", reimbursed: false, idempotencyKey: "init-key-1" },
  { date: today, amount: 180, desc: "Shilin night market boba & snacks", whose: "Roommate", category: "Dining Out", reimbursed: false, idempotencyKey: "init-key-2" },
  { date: yesterday, amount: 500, desc: "MRT EasyCard Top-Up", whose: "Mine", category: "Transport", reimbursed: false, idempotencyKey: "init-key-3" },
  { date: threeDaysAgo, amount: 620, desc: "PX Mart Weekly Groceries (Shared)", whose: "Roommate", category: "Groceries", reimbursed: true, idempotencyKey: "init-key-4" },
  { date: today, amount: 85, desc: "Bubble tea at Xing Fu Tang", whose: "Mine", category: "Dining Out", reimbursed: false, idempotencyKey: "init-key-5" },
  { date: yesterday, amount: 350, desc: "Din Tai Fung Xiao Long Bao", whose: "Roommate", category: "Dining Out", reimbursed: false, idempotencyKey: "init-key-6" },
  { date: threeDaysAgo, amount: 120, desc: "YouBike rental to NTU", whose: "Mine", category: "Transport", reimbursed: false, idempotencyKey: "init-key-7" },
  { date: today, amount: 2500, desc: "Semester tuition payment", whose: "Mine", category: "Education", reimbursed: false, idempotencyKey: "init-key-8" },
  { date: yesterday, amount: 180, desc: "FamilyMart convenience store dinner", whose: "Roommate", category: "Dining Out", reimbursed: true, idempotencyKey: "init-key-9" },
  { date: threeDaysAgo, amount: 450, desc: "Electricity bill for apartment", whose: "Mine", category: "Utilities", reimbursed: false, idempotencyKey: "init-key-10" },
  { date: today, amount: 500, desc: "Taiwan High Speed Rail ticket", whose: "Roommate", category: "Transport", reimbursed: false, idempotencyKey: "init-key-11" },
  { date: yesterday, amount: 890, desc: "Textbooks for economics course", whose: "Mine", category: "Education", reimbursed: false, idempotencyKey: "init-key-12" },
];

let seeded = false;

async function ensureSeeded() {
  if (seeded) return;
  seeded = true;

  const txCount = await prisma.transaction.count();
  if (txCount === 0) {
    await prisma.transaction.createMany({ data: DEFAULT_TRANSACTIONS as any });
  }

  const kwCount = await prisma.keyword.count();
  if (kwCount === 0) {
    await prisma.keyword.createMany({
      data: DEFAULT_KEYWORDS.map(([keyword, category]) => ({ keyword, category })),
    });
  }
}

function toTransaction(row: any): Transaction {
  return {
    id: row.id,
    date: row.date,
    amount: row.amount,
    desc: row.desc,
    whose: row.whose,
    category: row.category,
    reimbursed: row.reimbursed,
    idempotencyKey: row.idempotencyKey,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getTransactions(): Promise<Transaction[]> {
  await ensureSeeded();
  const rows = await prisma.transaction.findMany({ orderBy: { date: "desc" } });
  return rows.map(toTransaction);
}

export async function getTransactionById(id: string): Promise<Transaction | undefined> {
  await ensureSeeded();
  const row = await prisma.transaction.findUnique({ where: { id } });
  return row ? toTransaction(row) : undefined;
}

export async function getTransactionByIdempotencyKey(key: string): Promise<Transaction | undefined> {
  await ensureSeeded();
  const row = await prisma.transaction.findUnique({ where: { idempotencyKey: key } });
  return row ? toTransaction(row) : undefined;
}

export async function addTransaction(data: {
  date: string;
  amount: number;
  desc: string;
  whose: "Mine" | "Roommate";
  category?: string;
  idempotencyKey: string;
}): Promise<{ transaction: Transaction; duplicate: boolean }> {
  await ensureSeeded();

  if (data.idempotencyKey) {
    const existing = await getTransactionByIdempotencyKey(data.idempotencyKey);
    if (existing) {
      return { transaction: existing, duplicate: true };
    }
  }

  const keywords = await getKeywords();
  const category =
    data.category && data.category.trim() !== ""
      ? data.category.trim()
      : categorizeDescription(data.desc, keywords);

  const row = await prisma.transaction.create({
    data: {
      id: "tx-" + crypto.randomUUID(),
      date: data.date || new Date().toISOString().split("T")[0],
      amount: Number(data.amount) || 0,
      desc: data.desc.trim(),
      whose: data.whose,
      category,
      reimbursed: false,
      idempotencyKey: data.idempotencyKey,
    },
  });

  return { transaction: toTransaction(row), duplicate: false };
}

export async function updateTransaction(
  id: string,
  updates: Partial<Pick<Transaction, "reimbursed" | "category" | "desc">>
): Promise<Transaction | undefined> {
  await ensureSeeded();
  try {
    const row = await prisma.transaction.update({ where: { id }, data: updates });
    return toTransaction(row);
  } catch {
    return undefined;
  }
}

export async function deleteTransaction(id: string): Promise<boolean> {
  await ensureSeeded();
  try {
    await prisma.transaction.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getKeywords(): Promise<KeywordPair[]> {
  await ensureSeeded();
  const rows = await prisma.keyword.findMany();
  return rows.map((r) => [r.keyword, r.category] as KeywordPair);
}

export async function setKeywords(newKeywords: KeywordPair[]): Promise<KeywordPair[]> {
  await ensureSeeded();
  await prisma.keyword.deleteMany({});
  await prisma.keyword.createMany({
    data: newKeywords.map(([keyword, category]) => ({ keyword, category })),
  });
  return newKeywords;
}
