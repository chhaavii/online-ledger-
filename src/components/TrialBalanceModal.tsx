import React, { useState } from "react";
import { LedgerSummary, AccountBalance } from "../types";
import { X, CheckCircle2, AlertTriangle, Scale, Search } from "lucide-react";
import { playClickSound } from "../utils/audioEffects";

interface TrialBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  ledger: LedgerSummary | null;
}

export const TrialBalanceModal: React.FC<TrialBalanceModalProps> = ({
  isOpen,
  onClose,
  ledger,
}) => {
  const [tab, setTab] = useState<"accounts" | "journal">("accounts");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen || !ledger) return null;

  const { balanced, totalDebits, totalCredits, accounts, entries } = ledger;

  const accountList: AccountBalance[] = Object.values(accounts) as AccountBalance[];

  const filteredEntries = entries.filter(
    (e) =>
      e.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.memo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto font-mono">
      <div className="bg-[#2D3A47] border-2 border-[#3e4f60] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden text-[#FFF7E6]">
        {/* Header */}
        <div className="bg-[#182028] px-6 py-4 border-b border-[#3e4f60] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#B46A72]/20 border border-[#B46A72]/50 text-[#F7C8D3]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#FFF7E6] uppercase tracking-wider">
                DOUBLE-ENTRY TRIAL BALANCE
              </h2>
              <p className="text-xs text-[#A9B7C6]">
                Mathematical Verification of Debit & Credit Equilibrium
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#2D3A47] hover:bg-[#3b4b5a] text-[#A9B7C6] hover:text-[#FFF7E6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balanced Banner */}
        <div className="p-4 bg-[#1e2730] border-b border-[#3e4f60]">
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              balanced
                ? "bg-[#A8B58A]/20 border-[#A8B58A]/50 text-[#A8B58A]"
                : "bg-[#B46A72]/20 border-[#B46A72]/50 text-[#F7C8D3]"
            }`}
          >
            <div className="flex items-center space-x-3">
              {balanced ? (
                <CheckCircle2 className="w-6 h-6 text-[#A8B58A]" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-[#F7C8D3]" />
              )}
              <div>
                <div className="font-extrabold text-sm">
                  {balanced
                    ? "EQUILIBRIUM VERIFIED: BOOKS ARE PERFECTLY BALANCED"
                    : "ALERT: UNBALANCED LEDGER DETECTED"}
                </div>
                <div className="text-xs opacity-90">
                  Total Debits = NT$ {totalDebits.toLocaleString()} | Total Credits = NT$ {totalCredits.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="px-3 py-1 rounded bg-[#182028] border border-[#3e4f60] text-xs font-bold text-[#A8B58A]">
              Δ = {Math.abs(totalDebits - totalCredits).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#3e4f60] bg-[#182028] px-6 text-xs">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setTab("accounts");
            }}
            className={`py-3 px-4 font-extrabold transition-all border-b-2 cursor-pointer ${
              tab === "accounts"
                ? "border-[#F7C8D3] text-[#F7C8D3] bg-[#2D3A47]"
                : "border-transparent text-[#A9B7C6] hover:text-[#FFF7E6]"
            }`}
          >
            Account Balances ({accountList.length})
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setTab("journal");
            }}
            className={`py-3 px-4 font-extrabold transition-all border-b-2 cursor-pointer ${
              tab === "journal"
                ? "border-[#F7C8D3] text-[#F7C8D3] bg-[#2D3A47]"
                : "border-transparent text-[#A9B7C6] hover:text-[#FFF7E6]"
            }`}
          >
            Journal Entries Log ({entries.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-96 overflow-y-auto space-y-4">
          {tab === "accounts" ? (
            <div className="space-y-3">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#3e4f60] text-[#A9B7C6] uppercase">
                    <th className="py-2 px-3">Account Name</th>
                    <th className="py-2 px-3 text-right">Debit Total</th>
                    <th className="py-2 px-3 text-right">Credit Total</th>
                    <th className="py-2 px-3 text-right">Net Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3e4f60]">
                  {accountList.map((acc) => (
                    <tr key={acc.account} className="hover:bg-[#182028]/60">
                      <td className="py-2.5 px-3 font-bold text-[#FFF7E6]">
                        {acc.account}
                      </td>
                      <td className="py-2.5 px-3 text-right text-[#A8B58A]">
                        NT$ {acc.debitTotal.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-[#F7C8D3]">
                        NT$ {acc.creditTotal.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-[#FFF7E6]">
                        NT$ {acc.netBalance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Filter */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#A9B7C6]" />
                <input
                  type="text"
                  placeholder="Search journal entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#182028] border border-[#3e4f60] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#FFF7E6] focus:outline-none focus:border-[#F7C8D3]"
                />
              </div>

              <div className="space-y-2">
                {filteredEntries.map((entry, idx) => (
                  <div
                    key={idx}
                    className="bg-[#182028] p-2.5 rounded-xl border border-[#3e4f60] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            entry.type === "Debit"
                              ? "bg-[#A8B58A]/20 text-[#A8B58A] border border-[#A8B58A]/30"
                              : "bg-[#B46A72]/20 text-[#F7C8D3] border border-[#B46A72]/30"
                          }`}
                        >
                          {entry.type}
                        </span>
                        <span className="font-extrabold text-[#FFF7E6]">{entry.account}</span>
                      </div>
                      <div className="text-[#A9B7C6] text-[11px] mt-1">{entry.memo}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-[#FFF7E6]">
                        NT$ {entry.amount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#A9B7C6]">{entry.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#182028] px-6 py-3 border-t border-[#3e4f60] flex items-center justify-between text-xs text-[#A9B7C6]">
          <span>Double-entry balanced ledger calculations</span>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#2D3A47] hover:bg-[#3b4b5a] text-[#FFF7E6] font-bold rounded-xl transition-colors cursor-pointer border border-[#3e4f60]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
