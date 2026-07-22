import React from "react";
import { motion } from "motion/react";
import { Trash2, CheckCircle2, Clock } from "lucide-react";
import { Transaction } from "../types";
import { playClickSound } from "../utils/audioEffects";

interface ReceiptCardProps {
  transaction: Transaction;
  billIndex: number;
  onToggleReimbursed: (id: string, current: boolean) => void;
  onDeleteTransaction: (id: string) => void;
  isNew?: boolean;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({
  transaction,
  billIndex,
  onToggleReimbursed,
  onDeleteTransaction,
  isNew = false,
}) => {
  const billNum = String(billIndex).padStart(4, "0");

  const getCategoryBadgeClass = (category: string) => {
    switch (category.toLowerCase()) {
      case "groceries":
      case "boba & tea":
        return "bg-[#A8B58A]/20 text-[#A8B58A] border-[#A8B58A]/40";
      case "dining out":
      case "night market":
        return "bg-[#F7C8D3]/20 text-[#F7C8D3] border-[#F7C8D3]/40";
      case "transport":
      case "mrt":
        return "bg-[#A9B7C6]/20 text-[#A9B7C6] border-[#A9B7C6]/40";
      case "education":
      case "textbooks":
        return "bg-[#B46A72]/20 text-[#F7C8D3] border-[#B46A72]/40";
      default:
        return "bg-[#3e4f60]/40 text-[#FFF7E6] border-[#3e4f60]";
    }
  };

  return (
    <motion.div
      layout
      initial={isNew ? { scaleY: 0, opacity: 0, y: -20 } : { opacity: 0, y: 10 }}
      animate={{ scaleY: 1, opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, height: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      style={{ transformOrigin: "top center" }}
      className="relative w-full my-3 font-mono text-[#2D3A47]"
    >
      {/* Receipt Paper Chassis */}
      <div className="bg-[#FFF7E6] text-[#2D3A47] p-4 border-2 border-[#3e4f60] shadow-lg relative overflow-hidden rounded-xl">
        
        {/* Top Sawtooth Zig-zag Edge */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[radial-gradient(circle,_transparent_3px,_#FFF7E6_3px)] bg-[length:10px_10px]" />

        {/* Receipt Header */}
        <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-[#2D3A47]/30 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-[#2D3A47] tracking-widest">
              OFFICIAL BILL #{billNum}
            </span>
          </div>
          <span className="text-[11px] text-[#2D3A47]/70 font-bold">
            {transaction.date}
          </span>
        </div>

        {/* Receipt Body */}
        <div className="py-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-extrabold text-sm tracking-tight text-[#2D3A47]">
                {transaction.desc}
              </h3>
              
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {/* Category Badge */}
                <span className={`text-[10px] px-2 py-0.5 rounded-md border font-mono font-extrabold ${getCategoryBadgeClass(transaction.category)}`}>
                  {transaction.category}
                </span>

                {/* Owner Badge */}
                <span className={`text-[10px] px-2 py-0.5 rounded-md border font-mono font-extrabold ${
                  transaction.whose === "Mine" 
                    ? "bg-[#2D3A47] text-[#FFF7E6] border-[#2D3A47]"
                    : "bg-[#F7C8D3] text-[#2D3A47] border-[#F7C8D3]"
                }`}>
                  {transaction.whose === "Mine" ? "Mine (CHHAVI)" : "Roommate Fronted"}
                </span>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right">
              <div className="text-base font-black text-[#2D3A47]">
                NT$ {transaction.amount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Roommate Reimbursement Row */}
          {transaction.whose === "Roommate" && (
            <div className="flex items-center justify-between bg-[#F7C8D3]/30 p-2.5 rounded-xl border border-[#B46A72]/30 text-xs mt-2">
              <div className="flex items-center space-x-2">
                {transaction.reimbursed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#A8B58A]" />
                ) : (
                  <Clock className="w-4 h-4 text-[#B46A72]" />
                )}
                <span className={transaction.reimbursed ? "text-[#2D3A47] font-bold" : "text-[#B46A72] font-extrabold"}>
                  {transaction.reimbursed ? "Settled & Reimbursed" : "Roommate Owes You"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onToggleReimbursed(transaction.id, transaction.reimbursed);
                }}
                className={`px-3 py-1 text-[11px] font-extrabold rounded-lg transition-all shadow-sm cursor-pointer ${
                  transaction.reimbursed
                    ? "bg-[#2D3A47] text-[#FFF7E6]"
                    : "bg-[#B46A72] text-[#FFF7E6] hover:bg-[#c2767e]"
                }`}
              >
                {transaction.reimbursed ? "Mark Unpaid" : "Paid Me!"}
              </button>
            </div>
          )}
        </div>

        {/* Receipt Footer: Barcode & Actions */}
        <div className="pt-2 border-t-2 border-dashed border-[#2D3A47]/30 flex items-center justify-between">
          {/* Simulated Barcode */}
          <div className="flex items-center space-x-0.5 opacity-80">
            {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 2, 1].map((w, idx) => (
              <div key={idx} className="h-4 bg-[#2D3A47]" style={{ width: `${w}px` }} />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-[#2D3A47]/60 font-bold uppercase">
              ID: {transaction.id.slice(0, 8)}
            </span>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onDeleteTransaction(transaction.id);
              }}
              className="p-1 rounded text-[#2D3A47]/60 hover:text-[#B46A72] hover:bg-[#B46A72]/10 transition-colors cursor-pointer"
              title="Delete receipt"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Sawtooth Zig-zag Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[radial-gradient(circle,_transparent_3px,_#FFF7E6_3px)] bg-[length:10px_10px]" />
      </div>
    </motion.div>
  );
};
