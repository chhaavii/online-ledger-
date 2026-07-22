import React, { useState, useEffect } from "react";
// #made by chhavi :)
import { Transaction, LedgerSummary, KeywordPair, Whose } from "./types";
import { AtmMachine } from "./components/AtmMachine";
import { TransactionRoll } from "./components/TransactionRoll";
import { StatsOverview } from "./components/StatsOverview";
import { BarcodeStrip } from "./components/BarcodeStrip";
import { RoommateIouPanel } from "./components/RoommateIouPanel";
import { TrialBalanceModal } from "./components/TrialBalanceModal";
import { KeywordManagerModal } from "./components/KeywordManagerModal";
import { Sidebar, NavView } from "./components/Sidebar";
import { IntroScreen } from "./components/IntroScreen";
import {
  CreditCard,
  Menu,
  Scale,
  Tag,
  Gamepad2,
  Play,
  Receipt,
  Users,
  Barcode,
  ArrowLeft,
} from "lucide-react";
import { toggleSound, playClickSound } from "./utils/audioEffects";

// Generated background asset path
const TAIPEI_ANIME_BG = "/anime_atm_machine_street_1784705789849.jpg";

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ledger, setLedger] = useState<LedgerSummary | null>(null);
  const [keywords, setKeywords] = useState<KeywordPair[]>([]);
  const [, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastCreatedTxId, setLastCreatedTxId] = useState<string | null>(null);

  // App View & Intro State
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<NavView>("atm");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // Modals for direct popup triggers if requested from sub-pages
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState<boolean>(false);
  const [isKeywordsModalOpen, setIsKeywordsModalOpen] = useState<boolean>(false);

  const fetchAllData = async () => {
    try {
      const [txRes, ledgerRes, kwRes] = await Promise.all([
        fetch("/api/transactions"),
        fetch("/api/ledger"),
        fetch("/api/keywords"),
      ]);

      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData);
      }
      if (ledgerRes.ok) {
        const ledgerData = await ledgerRes.json();
        setLedger(ledgerData);
      }
      if (kwRes.ok) {
        const kwData = await kwRes.json();
        setKeywords(kwData);
      }
    } catch (err) {
      console.error("Failed to load initial data from server:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSubmitTransaction = async (txData: {
    date: string;
    amount: number;
    desc: string;
    whose: Whose;
    category: string;
    idempotencyKey: string;
  }) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txData),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.transaction) {
          setLastCreatedTxId(result.transaction.id);
        }
        await fetchAllData();
      }
    } catch (err) {
      console.error("Error submitting transaction:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleReimbursed = async (id: string, currentReimbursed: boolean) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reimbursed: !currentReimbursed }),
      });

      if (res.ok) {
        await fetchAllData();
      }
    } catch (err) {
      console.error("Error toggling reimbursement status:", err);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchAllData();
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  const handleSaveKeywords = async (newKeywords: KeywordPair[]) => {
    try {
      const res = await fetch("/api/keywords", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newKeywords),
      });

      if (res.ok) {
        const updated = await res.json();
        setKeywords(updated);
        await fetchAllData();
      }
    } catch (err) {
      console.error("Error saving keywords:", err);
    }
  };

  const handleToggleSound = () => {
    const updated = toggleSound();
    setSoundOn(updated);
  };

  // If Intro is active, show flying credit card intro sequence
  if (showIntro) {
    return (
      <IntroScreen
        onCompleteIntro={() => setShowIntro(false)}
        bgImageUrl={TAIPEI_ANIME_BG}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#1e2730] text-[#FFF7E6] font-sans relative overflow-x-hidden selection:bg-[#F7C8D3] selection:text-[#2D3A47]">
      
      {/* Anime Night Market Street Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-50 pointer-events-none z-0 scale-105 filter blur-[1px]"
        style={{ backgroundImage: `url(${TAIPEI_ANIME_BG})` }}
      />

      {/* Atmospheric Overlay Gradient */}
      <div className="fixed inset-0 bg-gradient-to-t from-[#1e2730] via-[#2D3A47]/80 to-[#1e2730]/90 pointer-events-none z-0" />

      {/* Main HUD Header */}
      <header className="sticky top-0 z-30 bg-[#2D3A47]/90 backdrop-blur-md border-b-2 border-[#3e4f60] shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Sidebar Trigger & App Logo */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setIsSidebarOpen(true);
              }}
              className="p-2 rounded-xl bg-[#1e2730] hover:bg-[#3b4b5a] border border-[#3e4f60] text-[#F7C8D3] hover:text-[#FFF7E6] transition-all shadow flex items-center gap-2 font-mono text-xs font-bold cursor-pointer"
            >
              <Menu className="w-5 h-5" />
              <span className="hidden sm:inline">HUD MENU</span>
            </button>

            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B46A72] to-[#F7C8D3] flex items-center justify-center text-[#2D3A47] font-bold shadow-lg shadow-[#B46A72]/20">
                <CreditCard className="w-5 h-5 text-[#2D3A47]" />
              </div>
              <div className="text-left">
                <h1 className="text-sm font-extrabold font-mono tracking-wider text-[#FFF7E6] uppercase flex items-center gap-2">
                  ONLINE LEDGER
                  <span className="text-[10px] bg-[#B46A72]/30 text-[#F7C8D3] border border-[#B46A72]/50 px-1.5 py-0.5 rounded">
                    CHHAVI
                  </span>
                </h1>
                <p className="text-[10px] font-mono text-[#A8B58A]">
                  TAIPEI STUDENT DOUBLE-ENTRY KIOSK
                </p>
              </div>
            </div>
          </div>

          {/* Right: Quick HUD Actions */}
          <div className="flex items-center space-x-2 font-mono">
            {activeView !== "atm" && (
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveView("atm");
                }}
                className="px-3 py-1.5 rounded-xl bg-[#B46A72]/20 hover:bg-[#B46A72]/40 border border-[#B46A72]/50 text-xs font-bold text-[#F7C8D3] transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>RETURN TO ATM</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setShowIntro(true);
              }}
              title="Replay intro animation"
              className="px-2.5 py-1.5 rounded-xl bg-[#1e2730] hover:bg-[#3b4b5a] border border-[#3e4f60] text-xs text-[#A9B7C6] hover:text-[#FFF7E6] transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-[#F7C8D3] text-[#F7C8D3]" />
              <span className="hidden md:inline">INTRO</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeView={activeView}
        onSelectView={(v) => setActiveView(v)}
        scanlinesEnabled={scanlinesEnabled}
        onToggleScanlines={() => setScanlinesEnabled(!scanlinesEnabled)}
        onTriggerIntroAnimation={() => setShowIntro(true)}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
      />

      {/* Main Container - Page View Switching */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* PAGE 1: ATM TERMINAL (ONLY REAL MACHINE ON SCREEN) */}
        {activeView === "atm" && (
          <div className="space-y-6">
            <div className="text-center max-w-md mx-auto space-y-1">
              <div className="inline-flex items-center space-x-1.5 bg-[#B46A72]/20 border border-[#B46A72]/40 px-3 py-1 rounded-full text-xs font-mono text-[#F7C8D3]">
                <Gamepad2 className="w-3.5 h-3.5 animate-pulse text-[#F7C8D3]" />
                <span>TAIPEI NIGHT MARKET ATM • PLAYER: CHHAVI</span>
              </div>
            </div>

            {/* Centered Physical ATM Terminal */}
            <AtmMachine
              onSubmitTransaction={handleSubmitTransaction}
              keywords={keywords}
              isSubmitting={isSubmitting}
              lastCreatedTxId={lastCreatedTxId}
            />

            {/* Quick Navigation Cards below ATM */}
            <div className="max-w-xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveView("roll");
                }}
                className="p-3 rounded-2xl bg-[#2D3A47]/90 hover:bg-[#2D3A47] border border-[#3e4f60] hover:border-[#FFF7E6] text-[#FFF7E6] transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Receipt className="w-4 h-4 text-[#FFF7E6]" />
                <span>RECEIPT ROLL ({transactions.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveView("iou");
                }}
                className="p-3 rounded-2xl bg-[#2D3A47]/90 hover:bg-[#2D3A47] border border-[#3e4f60] hover:border-[#F7C8D3] text-[#F7C8D3] transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Users className="w-4 h-4 text-[#F7C8D3]" />
                <span>ROOMMATE IOU</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveView("audit");
                }}
                className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-[#2D3A47]/90 hover:bg-[#2D3A47] border border-[#3e4f60] hover:border-[#A8B58A] text-[#A8B58A] transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Scale className="w-4 h-4 text-[#A8B58A]" />
                <span>LEDGER AUDIT</span>
              </button>
            </div>
          </div>
        )}

        {/* PAGE 2: THERMAL RECEIPT ROLL */}
        {activeView === "roll" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#3e4f60] pb-4 font-mono">
              <div>
                <h2 className="text-lg font-bold text-[#FFF7E6] flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#FFF7E6]" /> THERMAL RECEIPT ROLL
                </h2>
                <p className="text-xs text-[#A9B7C6]">
                  Chronological transaction receipt log printed by Taipei ATM
                </p>
              </div>
            </div>

            <TransactionRoll
              transactions={transactions}
              lastCreatedTxId={lastCreatedTxId}
              onToggleReimbursed={handleToggleReimbursed}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        )}

        {/* PAGE 3: DOUBLE-ENTRY LEDGER ENGINE AUDIT */}
        {activeView === "audit" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#3e4f60] pb-4 font-mono">
              <div>
                <h2 className="text-lg font-bold text-[#A8B58A] flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#A8B58A]" /> DOUBLE-ENTRY LEDGER ENGINE
                </h2>
                <p className="text-xs text-[#A9B7C6]">
                  Trial Balance Equilibrium: Total Debits must strictly equal Total Credits
                </p>
              </div>
            </div>

            <StatsOverview
              ledger={ledger}
              onOpenLedgerModal={() => setIsLedgerModalOpen(true)}
            />
          </div>
        )}

        {/* PAGE 4: ROOMMATE IOU TRACKER */}
        {activeView === "iou" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#3e4f60] pb-4 font-mono">
              <div>
                <h2 className="text-lg font-bold text-[#F7C8D3] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#F7C8D3]" /> ROOMMATE RECEIVABLE IOU TRACKER
                </h2>
                <p className="text-xs text-[#A9B7C6]">
                  Track fronted expenses & trigger one-click reimbursement settlements
                </p>
              </div>
            </div>

            <RoommateIouPanel
              transactions={transactions}
              onToggleReimbursed={handleToggleReimbursed}
            />
          </div>
        )}

        {/* PAGE 5: CATEGORY BARCODE & STATS */}
        {activeView === "barcode" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#3e4f60] pb-4 font-mono">
              <div>
                <h2 className="text-lg font-bold text-[#A9B7C6] flex items-center gap-2">
                  <Barcode className="w-5 h-5 text-[#A9B7C6]" /> CATEGORY BARCODE & SPECTRAL BREAKDOWN
                </h2>
                <p className="text-xs text-[#A9B7C6]">
                  Visual spectral distribution of expenses across categories
                </p>
              </div>
            </div>

            <BarcodeStrip transactions={transactions} />
          </div>
        )}

        {/* PAGE 6: KEYWORD AUTO-ROUTER */}
        {activeView === "keywords" && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between border-b border-[#3e4f60] pb-4 font-mono">
              <div>
                <h2 className="text-lg font-bold text-[#F7C8D3] flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#F7C8D3]" /> KEYWORD AUTO-CATEGORIZATION
                </h2>
                <p className="text-xs text-[#A9B7C6]">
                  Longest-match algorithm ensures "night market" beats "market"
                </p>
              </div>
            </div>

            <div className="p-6 bg-[#2D3A47]/95 border-2 border-[#3e4f60] rounded-2xl font-mono space-y-4">
              <div className="text-xs text-[#FFF7E6]">
                You have <span className="text-[#F7C8D3] font-bold">{keywords.length}</span> active auto-categorization rules configured.
              </div>
              <button
                type="button"
                onClick={() => setIsKeywordsModalOpen(true)}
                className="py-3 px-6 bg-[#B46A72] hover:bg-[#c2767e] text-[#FFF7E6] font-extrabold rounded-xl shadow transition-all flex items-center gap-2 text-xs cursor-pointer"
              >
                <Tag className="w-4 h-4" />
                <span>OPEN KEYWORD RULE MANAGER</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#3e4f60] bg-[#1e2730]/90 py-6 text-center font-mono text-xs text-[#A9B7C6] relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Online Ledger • Double-Entry Bookkeeping Engine for Player CHHAVI
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                playClickSound();
                setActiveView("keywords");
              }}
              className="hover:text-[#F7C8D3] transition-colors cursor-pointer"
            >
              Auto-Categorization Rules
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TrialBalanceModal
        isOpen={isLedgerModalOpen}
        onClose={() => setIsLedgerModalOpen(false)}
        ledger={ledger}
      />

      <KeywordManagerModal
        isOpen={isKeywordsModalOpen}
        onClose={() => setIsKeywordsModalOpen(false)}
        keywords={keywords}
        onSaveKeywords={handleSaveKeywords}
      />
    </div>
  );
}
