import React, { useState } from "react";
import { Transaction } from "../types";
import { Users, CheckCircle2, Clock, CheckCheck } from "lucide-react";
import { playClickSound } from "../utils/audioEffects";

interface RoommateIouPanelProps {
  transactions: Transaction[];
  onToggleReimbursed: (id: string, current: boolean) => void;
}

export const RoommateIouPanel: React.FC<RoommateIouPanelProps> = ({
  transactions,
  onToggleReimbursed,
}) => {
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  const roommateTxs = transactions.filter((t) => t.whose === "Roommate");
  const pendingTxs = roommateTxs.filter((t) => !t.reimbursed);
  const totalOwed = pendingTxs.reduce((sum, t) => sum + t.amount, 0);

  const displayedTxs = filter === "pending" ? pendingTxs : roommateTxs;

  const handleSettleAll = () => {
    playClickSound();
    for (const tx of pendingTxs) {
      onToggleReimbursed(tx.id, false);
    }
  };

  return (
    <div className="bg-[#2D3A47] border-2 border-[#3e4f60] rounded-2xl p-5 text-[#FFF7E6] shadow-xl space-y-4 font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#3e4f60]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#B46A72]/20 border border-[#B46A72]/50 flex items-center justify-center text-[#F7C8D3]">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#F7C8D3] uppercase tracking-widest">
              ROOMMATE IOU TRACKER
            </h3>
            <p className="text-sm font-extrabold text-[#FFF7E6]">
              Net Owed to You: <span className="text-[#A8B58A]">NT$ {totalOwed.toLocaleString()}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {pendingTxs.length > 0 && (
            <button
              type="button"
              onClick={handleSettleAll}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#B46A72] hover:bg-[#c2767e] text-[#FFF7E6] font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer border border-[#FFF7E6]/30"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>SETTLE ALL ({pendingTxs.length})</span>
            </button>
          )}

          {/* Filter toggle */}
          <div className="flex bg-[#182028] p-1 rounded-xl border border-[#3e4f60] text-xs">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setFilter("pending");
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === "pending"
                  ? "bg-[#B46A72] text-[#FFF7E6] font-extrabold"
                  : "text-[#A9B7C6] hover:text-[#FFF7E6]"
              }`}
            >
              Pending ({pendingTxs.length})
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setFilter("all");
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === "all"
                  ? "bg-[#B46A72] text-[#FFF7E6] font-extrabold"
                  : "text-[#A9B7C6] hover:text-[#FFF7E6]"
              }`}
            >
              All ({roommateTxs.length})
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      {displayedTxs.length === 0 ? (
        <div className="text-center py-8 bg-[#182028] rounded-xl border border-[#3e4f60] text-xs text-[#A9B7C6] space-y-1">
          <CheckCircle2 className="w-6 h-6 text-[#A8B58A] mx-auto mb-2" />
          <p className="text-[#FFF7E6] font-bold">No outstanding roommate IOUs!</p>
          <p className="text-[#A9B7C6]">All fronted expenses have been settled and reconciled.</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {displayedTxs.map((tx) => (
            <div
              key={tx.id}
              className="bg-[#182028] p-3 rounded-xl border border-[#3e4f60] flex items-center justify-between gap-3 hover:border-[#B46A72] transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`mt-0.5 p-2 rounded-lg border text-xs ${
                    tx.reimbursed
                      ? "bg-[#A8B58A]/20 border-[#A8B58A]/40 text-[#A8B58A]"
                      : "bg-[#B46A72]/20 border-[#B46A72]/40 text-[#F7C8D3]"
                  }`}
                >
                  {tx.reimbursed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4 animate-pulse" />
                  )}
                </div>

                <div>
                  <div className="font-extrabold text-sm text-[#FFF7E6]">{tx.desc}</div>
                  <div className="flex items-center space-x-2 text-xs text-[#A9B7C6] mt-0.5">
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span className="text-[#F7C8D3] font-bold">{tx.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-right">
                <div>
                  <div className="font-bold text-sm text-[#F7C8D3]">
                    NT$ {tx.amount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#A9B7C6]">
                    {tx.reimbursed ? "REIMBURSED" : "UNPAID"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onToggleReimbursed(tx.id, tx.reimbursed);
                  }}
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all shadow cursor-pointer ${
                    tx.reimbursed
                      ? "bg-[#2D3A47] hover:bg-[#3b4b5a] text-[#FFF7E6] border border-[#3e4f60]"
                      : "bg-[#B46A72] hover:bg-[#c2767e] text-[#FFF7E6]"
                  }`}
                >
                  {tx.reimbursed ? "Unmark" : "Paid Me!"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
