import React from "react";
import { LedgerSummary } from "../types";
import { Wallet, Calendar, Users, Scale, CheckCircle2, AlertTriangle, ArrowUpRight, FileCheck } from "lucide-react";
import { playClickSound } from "../utils/audioEffects";

interface StatsOverviewProps {
  ledger: LedgerSummary | null;
  onOpenLedgerModal: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ ledger, onOpenLedgerModal }) => {
  if (!ledger) return null;

  const { stats, balanced, totalDebits, totalCredits } = ledger;

  return (
    <div className="bg-[#2D3A47] border-2 border-[#3e4f60] rounded-2xl p-5 text-[#FFF7E6] shadow-xl space-y-4 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#3e4f60]">
        <div>
          <h2 className="text-xs font-bold tracking-widest text-[#F7C8D3] uppercase">
            LEDGER STATS & DOUBLE-ENTRY
          </h2>
          <p className="text-sm font-extrabold text-[#FFF7E6]">Personal & Roommate Account</p>
        </div>

        {/* Books Balanced Badge */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onOpenLedgerModal();
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-sm cursor-pointer ${
            balanced
              ? "bg-[#A8B58A]/20 border-[#A8B58A] text-[#A8B58A] hover:bg-[#A8B58A]/30"
              : "bg-[#B46A72]/20 border-[#B46A72] text-[#F7C8D3] hover:bg-[#B46A72]/30"
          }`}
        >
          {balanced ? <CheckCircle2 className="w-4 h-4 text-[#A8B58A]" /> : <AlertTriangle className="w-4 h-4 text-[#F7C8D3]" />}
          <span>{balanced ? "BOOKS BALANCED" : "UNBALANCED LEDGER"}</span>
          <FileCheck className="w-3.5 h-3.5 ml-1 opacity-70" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Spent (Mine) */}
        <div className="bg-[#182028] p-3.5 rounded-xl border border-[#3e4f60] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#A9B7C6] text-xs mb-1">
            <span>Total Spent (Mine)</span>
            <Wallet className="w-4 h-4 text-[#A8B58A]" />
          </div>
          <div className="text-lg font-bold text-[#FFF7E6]">
            NT$ {stats.totalSpentMine.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#A9B7C6] mt-1">All personal expenses</span>
        </div>

        {/* This Month (Mine) */}
        <div className="bg-[#182028] p-3.5 rounded-xl border border-[#3e4f60] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#A9B7C6] text-xs mb-1">
            <span>This Month (Mine)</span>
            <Calendar className="w-4 h-4 text-[#A9B7C6]" />
          </div>
          <div className="text-lg font-bold text-[#A9B7C6]">
            NT$ {stats.thisMonthMine.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#A9B7C6] mt-1">Excludes roommate fronted</span>
        </div>

        {/* Fronted for Roommate */}
        <div className="bg-[#182028] p-3.5 rounded-xl border border-[#3e4f60] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#A9B7C6] text-xs mb-1">
            <span>Fronted (Roommate)</span>
            <Users className="w-4 h-4 text-[#F7C8D3]" />
          </div>
          <div className="text-lg font-bold text-[#F7C8D3]">
            NT$ {stats.frontedRoommate.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#A9B7C6] mt-1">Gross paid for roommate</span>
        </div>

        {/* Amount She Owes */}
        <div className="bg-[#182028] p-3.5 rounded-xl border border-[#3e4f60] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#A9B7C6] text-xs mb-1">
            <span>She Owes You</span>
            <Scale className="w-4 h-4 text-[#A8B58A]" />
          </div>
          <div className="text-lg font-bold text-[#A8B58A]">
            NT$ {stats.amountOwedByRoommate.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#A9B7C6] mt-1">Net pending receivable</span>
        </div>
      </div>

      {/* Double-Entry Running Check Summary Banner */}
      <div
        onClick={() => {
          playClickSound();
          onOpenLedgerModal();
        }}
        className="cursor-pointer bg-[#182028] p-3 rounded-xl border border-[#3e4f60] flex items-center justify-between hover:border-[#B46A72] transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#B46A72]/20 border border-[#B46A72]/50 flex items-center justify-center text-[#F7C8D3] font-bold text-xs">
            Σ
          </div>
          <div>
            <div className="text-xs text-[#FFF7E6]">
              Double-Entry GAAP Check: <span className="text-[#A8B58A] font-bold">Debits = Credits</span>
            </div>
            <div className="text-xs text-[#A9B7C6]">
              Total Debits: <span className="text-[#FFF7E6]">NT$ {totalDebits.toLocaleString()}</span> | Total Credits: <span className="text-[#FFF7E6]">NT$ {totalCredits.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center text-xs font-bold text-[#F7C8D3] hover:underline">
          <span>Audit Ledger</span>
          <ArrowUpRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </div>
  );
};
