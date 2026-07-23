import React, { useState } from "react";
// #made by chhavi :)
import { AnimatePresence } from "motion/react";
import { Transaction } from "../types";
import { ReceiptCard } from "./ReceiptCard";
import { Search, Printer } from "lucide-react";

interface TransactionRollProps {
  transactions: Transaction[];
  lastCreatedTxId: string | null;
  onToggleReimbursed: (id: string, current: boolean) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionRoll: React.FC<TransactionRollProps> = ({
  transactions,
  lastCreatedTxId,
  onToggleReimbursed,
  onDeleteTransaction,
}) => {
  const [filterType, setFilterType] = useState<"All" | "Mine" | "Roommate">("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  // Get list of unique categories
  const categories = Array.from(new Set(transactions.map((t) => t.category))).filter(Boolean);

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "Mine" && t.whose !== "Mine") return false;
    if (filterType === "Roommate" && t.whose !== "Roommate") return false;
    if (categoryFilter !== "All" && t.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchDesc = t.desc.toLowerCase().includes(q);
      const matchCat = t.category.toLowerCase().includes(q);
      const matchAmt = t.amount.toString().includes(q);
      if (!matchDesc && !matchCat && !matchAmt) return false;
    }
    return true;
  });

  return (
    <div className="w-full max-w-xl mx-auto my-6 space-y-4 font-mono text-[#FFF7E6]">
      {/* Header Controls & Filters */}
      <div className="bg-[#2D3A47] border-2 border-[#3e4f60] rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-[#F7C8D3]" />
            <h3 className="text-xs font-bold text-[#FFF7E6] uppercase tracking-widest">
              THERMAL BILL ROLL ({filteredTransactions.length} BILLS)
            </h3>
          </div>

          <span className="text-[11px] text-[#A9B7C6] bg-[#182028] px-2.5 py-1 rounded border border-[#3e4f60]">
            NEWEST ON TOP
          </span>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#A9B7C6]" />
            <input
              type="text"
              placeholder="Search bills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#182028] border border-[#3e4f60] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#FFF7E6] placeholder-[#A9B7C6]/60 focus:outline-none focus:border-[#F7C8D3]"
            />
          </div>

          {/* Owner Filter */}
          <div className="sm:col-span-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full bg-[#182028] border border-[#3e4f60] rounded-xl px-2 py-1.5 text-xs text-[#FFF7E6] focus:outline-none cursor-pointer"
            >
              <option value="All">All Owners</option>
              <option value="Mine">Mine Only</option>
              <option value="Roommate">Roommate Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#182028] border border-[#3e4f60] rounded-xl px-2 py-1.5 text-xs text-[#FFF7E6] focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stacked Roll of Receipts */}
      <div className="relative">
        {/* Paper Cutter Slot Visual Graphic */}
        <div className="w-full h-3 bg-[#182028] border-x-2 border-b-2 border-[#3e4f60] rounded-b-xl shadow-md flex items-center justify-center mb-1">
          <div className="w-32 h-1 bg-[#2D3A47] rounded-full" />
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="bg-[#2D3A47] border-2 border-[#3e4f60] rounded-2xl p-8 text-center text-xs text-[#A9B7C6] space-y-2">
            <Printer className="w-8 h-8 text-[#A9B7C6]/60 mx-auto" />
            <p className="font-bold text-[#FFF7E6]">No receipt bills match your filter.</p>
            <p className="text-[#A9B7C6]">Add a transaction above using the ATM terminal!</p>
          </div>
        ) : (
          <div className="space-y-1">
            <AnimatePresence initial={false}>
              {filteredTransactions.map((tx) => {
                const billNum = transactions.length - transactions.findIndex((t) => t.id === tx.id);
                const isNew = tx.id === lastCreatedTxId;

                return (
                  <ReceiptCard
                    key={tx.id}
                    transaction={tx}
                    billIndex={billNum}
                    onToggleReimbursed={onToggleReimbursed}
                    onDeleteTransaction={onDeleteTransaction}
                    isNew={isNew}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
