import React, { useState, useEffect } from "react";
// #made by chhavi :)
import { motion, AnimatePresence } from "motion/react";
import { CreditCard, Sparkles, Send, RefreshCw, CheckCircle2, Tag, Calendar, DollarSign, FileText, User, ShieldCheck, Tv } from "lucide-react";
import { Whose, KeywordPair } from "../types";
import { categorizeDescription } from "../ledgerEngine";
import { playCardInsertSound, playPrintReceiptSound, playClickSound, playPaperTearSound } from "../utils/audioEffects";

interface AtmMachineProps {
  onSubmitTransaction: (txData: {
    date: string;
    amount: number;
    desc: string;
    whose: Whose;
    category: string;
    idempotencyKey: string;
  }) => Promise<void>;
  keywords: KeywordPair[];
  isSubmitting: boolean;
  lastCreatedTxId: string | null;
}

export const AtmMachine: React.FC<AtmMachineProps> = ({
  onSubmitTransaction,
  keywords,
  isSubmitting,
  lastCreatedTxId,
}) => {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [whose, setWhose] = useState<Whose>("Mine");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  // Physical Card Insertion & Drag State
  const [cardInserted, setCardInserted] = useState(true);
  const [isInsertingCard, setIsInsertingCard] = useState(false);
  const [cardSlotFlash, setCardSlotFlash] = useState(false);

  // Receipt Printing & Sideways Tear-Off State
  const [printingStage, setPrintingStage] = useState<"idle" | "printing" | "dispensed">("idle");
  const [printedReceiptData, setPrintedReceiptData] = useState<{
    desc: string;
    amount: number;
    date: string;
    whose: Whose;
    category: string;
    idempotencyKey: string;
    billNumber: string;
  } | null>(null);

  const [receiptDragX, setReceiptDragX] = useState(0);
  const [isReceiptTorn, setIsReceiptTorn] = useState(false);

  // Auto-categorize active description
  const activeCategory = useCustomCategory && customCategory.trim()
    ? customCategory.trim()
    : categorizeDescription(desc, keywords);

  // Interactive Card Insertion Handlers
  const handleInsertCard = () => {
    if (cardInserted || isInsertingCard) return;
    setIsInsertingCard(true);
    playCardInsertSound();
    setCardSlotFlash(true);

    setTimeout(() => {
      setCardInserted(true);
      setIsInsertingCard(false);
      setCardSlotFlash(false);
    }, 600);
  };

  const handleEjectCard = () => {
    playCardInsertSound();
    setCardInserted(false);
  };

  // Interactive Tear-Off Handler
  const handleTearReceipt = () => {
    if (isReceiptTorn) return;
    playPaperTearSound();
    setIsReceiptTorn(true);

    setTimeout(() => {
      setPrintingStage("idle");
      setPrintedReceiptData(null);
      setIsReceiptTorn(false);
      setReceiptDragX(0);
    }, 450);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !amount || Number(amount) <= 0) return;

    playPrintReceiptSound();

    // Reset any previous receipt so a new print always animates fresh
    setIsReceiptTorn(false);
    setReceiptDragX(0);

    const idempotencyKey = "key-" + Date.now() + "-" + Math.random().toString(36).slice(2, 11);
    const billNum = "TX-" + Math.floor(1000 + Math.random() * 9000);

    const txPayload = {
      date,
      amount: Number(amount),
      desc: desc.trim(),
      whose,
      category: activeCategory,
      idempotencyKey,
    };

    setPrintedReceiptData({
      ...txPayload,
      billNumber: billNum,
    });
    setPrintingStage("printing");

    // Submit transaction
    await onSubmitTransaction(txPayload);

    // After printing animation duration, set to dispensed
    setTimeout(() => {
      setPrintingStage("dispensed");
    }, 1800);

    // Reset inputs after successful print
    setDesc("");
    setAmount("");
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto my-2 font-mono">
      
      {/* REAL PHYSICAL ATM KIOSK CABINET HOUSING */}
      <div id="atm-chassis" className="bg-[#2D3A47] border-4 border-[#3e4f60] rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden text-[#FFF7E6] border-t-[#4e6277] border-b-[#1e2730]">
        
        {/* Machine Top Marquee / Illuminated Neon Banner */}
        <div className="bg-[#1e2730] border-2 border-[#B46A72]/60 rounded-2xl p-3 mb-4 shadow-inner flex items-center justify-between relative overflow-hidden">
          {/* Neon shimmer background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#B46A72]/20 via-[#F7C8D3]/20 to-[#B46A72]/20 pointer-events-none animate-pulse" />

          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#B46A72]/30 border border-[#F7C8D3]/60 flex items-center justify-center text-[#F7C8D3] shadow-md">
              <CreditCard className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black tracking-widest text-[#F7C8D3] uppercase">
                  TAIPEI ATM TERMINAL #88
                </span>
                <span className="w-2 h-2 rounded-full bg-[#A8B58A] animate-ping" />
              </div>
              <p className="text-[11px] text-[#A9B7C6]">PLAYER: CHHAVI • TAIPEI EASYCARD PASS</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 relative z-10">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                if (cardInserted) {
                  handleEjectCard();
                } else {
                  handleInsertCard();
                }
              }}
              title={cardInserted ? "Eject EasyCard" : "Insert EasyCard"}
              className="px-2.5 py-1.5 bg-[#2D3A47] hover:bg-[#3b4b5a] border border-[#3e4f60] text-[11px] text-[#F7C8D3] hover:text-[#FFF7E6] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isInsertingCard ? "animate-spin" : ""}`} />
              <span>{cardInserted ? "EJECT CARD 💳" : "INSERT CARD 💳"}</span>
            </button>
          </div>
        </div>

        {/* EMBEDDED CRT / OLED SCREEN DISPLAY MONITOR */}
        <div className="bg-[#182028] border-4 border-[#12181f] rounded-2xl p-4 sm:p-5 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] relative overflow-hidden">
          
          {/* Screen Header Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2D3A47] text-xs">
            <div className="flex items-center space-x-2 text-[#F7C8D3]">
              <Tv className="w-4 h-4 text-[#F7C8D3]" />
              <span className="font-bold tracking-wider">
                {cardInserted ? "SYSTEM READY" : "INSERT CARD TO START"}
              </span>
            </div>
            <div className="text-[10px] text-[#A9B7C6] bg-[#2D3A47] px-2.5 py-1 rounded-md border border-[#3e4f60]">
              DOUBLE-ENTRY LEDGER ACTIVE
            </div>
          </div>

          {/* SCREEN CONTENT: TRANSACTION FORM OR CARD WAITING */}
          <AnimatePresence mode="wait">
            {!cardInserted ? (
              <motion.div
                key="waiting-for-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 flex flex-col items-center justify-center text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-full bg-[#B46A72]/20 border border-[#B46A72]/60 flex items-center justify-center text-[#F7C8D3] animate-bounce shadow-lg">
                  <CreditCard className="w-7 h-7 text-[#F7C8D3]" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#F7C8D3] tracking-widest uppercase">
                    PLEASE INSERT CHHAVI'S EASYCARD
                  </div>
                  <p className="text-xs text-[#A9B7C6] mt-1 max-w-sm">
                    Hold & drag the physical EasyCard below upwards into the slot, or click to insert!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleInsertCard}
                  className="mt-2 px-4 py-2 bg-[#B46A72] hover:bg-[#c2767e] text-[#FFF7E6] font-bold text-xs rounded-xl shadow transition-all cursor-pointer border border-[#F7C8D3]/40"
                >
                  INSERT CARD NOW 💳
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="atm-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleFormSubmit}
                className="space-y-3.5"
              >
                {/* Description & Amount row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-left">
                  <div className="sm:col-span-7">
                    <label className="block text-xs font-bold text-[#F7C8D3] mb-1 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-[#F7C8D3]" /> ITEM DESCRIPTION
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 7-11 bento, boba tea, MRT top-up"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="w-full bg-[#2D3A47] border border-[#3e4f60] rounded-xl px-3 py-2 text-xs text-[#FFF7E6] placeholder-[#A9B7C6]/60 focus:outline-none focus:border-[#F7C8D3] focus:ring-1 focus:ring-[#F7C8D3]"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-xs font-bold text-[#F7C8D3] mb-1 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#F7C8D3]" /> AMOUNT (NT$)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-[#A8B58A]">NT$</span>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="120"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-[#2D3A47] border border-[#3e4f60] rounded-xl pl-11 pr-3 py-2 text-xs font-bold text-[#A8B58A] placeholder-[#A9B7C6]/60 focus:outline-none focus:border-[#F7C8D3] focus:ring-1 focus:ring-[#F7C8D3]"
                      />
                    </div>
                  </div>
                </div>

                {/* Expense Owner & Date row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-left">
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-bold text-[#F7C8D3] mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#F7C8D3]" /> EXPENSE OWNER
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 bg-[#2D3A47] p-1 rounded-xl border border-[#3e4f60]">
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setWhose("Mine");
                        }}
                        className={`py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                          whose === "Mine"
                            ? "bg-[#B46A72] text-[#FFF7E6] shadow-[0_0_10px_rgba(180,106,114,0.5)]"
                            : "text-[#A9B7C6] hover:text-[#FFF7E6]"
                        }`}
                      >
                        Mine (CHHAVI)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setWhose("Roommate");
                        }}
                        className={`py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                          whose === "Roommate"
                            ? "bg-[#F7C8D3] text-[#2D3A47] shadow-[0_0_10px_rgba(247,200,211,0.5)]"
                            : "text-[#A9B7C6] hover:text-[#FFF7E6]"
                        }`}
                      >
                        Roommate
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-xs font-bold text-[#F7C8D3] mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#F7C8D3]" /> DATE
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#2D3A47] border border-[#3e4f60] rounded-xl px-3 py-2 text-xs text-[#FFF7E6] focus:outline-none focus:border-[#F7C8D3]"
                    />
                  </div>
                </div>

                {/* Auto-Category Status */}
                <div className="flex items-center justify-between text-xs bg-[#2D3A47]/80 p-2.5 rounded-xl border border-[#3e4f60]">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-3.5 h-3.5 text-[#F7C8D3]" />
                    <span className="text-[#A9B7C6]">Category:</span>
                    <span className="px-2 py-0.5 rounded font-extrabold bg-[#B46A72]/30 text-[#F7C8D3] border border-[#B46A72]/50">
                      {activeCategory}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setUseCustomCategory(!useCustomCategory);
                    }}
                    className="text-[11px] text-[#A9B7C6] hover:text-[#F7C8D3] underline font-bold cursor-pointer"
                  >
                    {useCustomCategory ? "Auto-detect" : "Edit Category"}
                  </button>
                </div>

                {useCustomCategory && (
                  <input
                    type="text"
                    placeholder="Custom category name..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full bg-[#2D3A47] border border-[#3e4f60] rounded-xl px-3 py-1.5 text-xs text-[#FFF7E6]"
                  />
                )}

                {/* Submit / Print Receipt Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !desc.trim() || !amount}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#B46A72] via-[#F7C8D3] to-[#B46A72] hover:from-[#c2767e] hover:to-[#F7C8D3] disabled:opacity-50 text-[#2D3A47] font-black tracking-wider text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(180,106,114,0.4)] flex items-center justify-center space-x-2 cursor-pointer border border-[#FFF7E6]/40"
                >
                  <Send className="w-4 h-4 text-[#2D3A47]" />
                  <span>{isSubmitting ? "PRINTING THERMAL RECEIPT..." : "PRINT RECEIPT BILL"}</span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* PHYSICAL MACHINE CONTROLS & SLOTS (Below Screen) */}
        <div className="mt-4 pt-4 border-t-2 border-[#1e2730] grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          
          {/* Left: Interactive Physical Card Reader Slot */}
          <div className="md:col-span-6 bg-[#1e2730] p-3.5 rounded-2xl border border-[#3e4f60] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-[#F7C8D3] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${cardInserted ? "bg-[#A8B58A]" : "bg-[#B46A72] animate-ping"}`} />
                CARD READER SLOT
              </span>
              <span className="text-[9px] font-bold text-[#A9B7C6]">
                {cardInserted ? "STATUS: INSERTED ✅" : "STATUS: EMPTY ⚠️"}
              </span>
            </div>

            {/* Glowing Metal Slot Bezel */}
            <div className={`w-full max-w-xs h-4 bg-[#12181f] rounded-full border-2 transition-colors relative flex items-center justify-center shadow-inner my-1 ${
              cardSlotFlash
                ? "border-[#A8B58A] shadow-[0_0_12px_#A8B58A]"
                : cardInserted
                ? "border-[#A8B58A]/60"
                : "border-[#B46A72]"
            }`}>
              {/* LED Glow Strip */}
              <div className={`w-3/4 h-1 rounded-full blur-[1px] transition-all ${
                cardSlotFlash
                  ? "bg-[#FFF7E6] animate-ping"
                  : cardInserted
                  ? "bg-[#A8B58A]"
                  : "bg-[#B46A72] animate-pulse"
              }`} />
            </div>

            {/* INTERACTIVE CARD CONTAINER */}
            <div className="relative min-h-[70px] w-full flex flex-col items-center justify-center pt-2">
              <AnimatePresence mode="wait">
                {cardInserted ? (
                  <motion.div
                    key="card-in-slot"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="w-full flex flex-col items-center space-y-2"
                  >
                    <div className="px-3 py-1 rounded-lg bg-[#2D3A47] border border-[#A8B58A]/50 text-[10px] font-extrabold text-[#A8B58A] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#A8B58A]" />
                      <span>CHHAVI'S EASYCARD ENGAGED</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleEjectCard}
                      className="text-[10px] bg-[#B46A72]/20 hover:bg-[#B46A72]/40 text-[#F7C8D3] px-3 py-1 rounded-xl border border-[#B46A72]/60 font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>EJECT EASYCARD 💳</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="interactive-physical-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full flex flex-col items-center"
                  >
                    {/* Draggable EasyCard */}
                    <motion.div
                      drag="y"
                      dragConstraints={{ top: -60, bottom: 0 }}
                      dragSnapToOrigin={true}
                      onDragEnd={(_, info) => {
                        if (info.offset.y < -25) {
                          handleInsertCard();
                        }
                      }}
                      onClick={handleInsertCard}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97, cursor: "grabbing" }}
                      className="w-full max-w-[260px] bg-gradient-to-r from-[#2D3A47] via-[#B46A72] to-[#2D3A47] border-2 border-[#F7C8D3] p-2.5 rounded-xl shadow-2xl flex items-center justify-between cursor-grab active:cursor-grabbing select-none relative group"
                    >
                      {/* Metallic IC Chip */}
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-4 bg-gradient-to-tr from-[#e2c178] to-[#f9e8a2] rounded border border-[#b89547] shadow-inner" />
                        <div className="text-left">
                          <div className="text-[10px] font-black text-[#FFF7E6] tracking-wider">
                            CHHAVI • EASYCARD
                          </div>
                          <div className="text-[8px] text-[#F7C8D3] font-bold">
                            TAIPEI MRT PASS
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end">
                        <span className="text-[9px] font-extrabold text-[#A8B58A] bg-[#182028] px-1.5 py-0.5 rounded border border-[#3e4f60]">
                          NT$ 1,250
                        </span>
                        <span className="text-[8px] text-[#F7C8D3] font-black mt-0.5 animate-bounce">
                          👆 DRAG UP
                        </span>
                      </div>
                    </motion.div>

                    <p className="text-[9px] text-[#A9B7C6] mt-1.5 font-bold">
                      👆 Hold & drag card up into slot or click to insert
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Thermal Receipt Dispenser Outlet Slot */}
          <div className="md:col-span-6 bg-[#1e2730] p-3.5 rounded-2xl border border-[#3e4f60] text-center relative flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-[#F7C8D3] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#F7C8D3]" /> RECEIPT DISPENSER
              </span>
              <button
                type="button"
                onClick={() => {
                  playPrintReceiptSound();
                  setPrintedReceiptData({
                    desc: "7-11 Bento & Boba",
                    amount: 145,
                    date: new Date().toISOString().split("T")[0],
                    whose: "Mine",
                    category: "Dining Out",
                    idempotencyKey: "demo-" + Math.random(),
                    billNumber: "TX-" + Math.floor(1000 + Math.random() * 9000),
                  });
                  setPrintingStage("printing");
                  setTimeout(() => setPrintingStage("dispensed"), 1800);
                }}
                className="text-[9px] bg-[#2D3A47] hover:bg-[#3e4f60] text-[#A8B58A] px-2 py-0.5 rounded border border-[#3e4f60] font-bold cursor-pointer transition-all"
              >
                TEST PRINT 📄
              </button>
            </div>

            {/* Dispenser Slot Bezel */}
            <div className="w-full h-3 bg-[#12181f] rounded-full border border-[#3e4f60] mx-auto flex items-center justify-center relative overflow-hidden shadow-inner z-20">
              <div className="w-2/3 h-0.5 bg-[#A8B58A] blur-[1px] animate-pulse" />
            </div>

            {/* PHYSICAL PRINTED PAPER RECEIPT FEEDING DOWNWARDS */}
            <div className="relative w-full min-h-[20px] flex flex-col items-center justify-center z-10 pt-1">
              <AnimatePresence>
                {printingStage !== "idle" && printedReceiptData && (
                  <div className="w-full flex flex-col items-center">
                    
                    {/* Drag Instruction Banner */}
                    <div className="mb-1 text-[9px] font-extrabold text-[#F7C8D3] animate-pulse flex items-center gap-1">
                      <span>👈 HOLD & DRAG SIDEWAYS TO TEAR OFF ✂️ 👉</span>
                    </div>

                    {/* Interactive Draggable Receipt */}
                    <motion.div
                      key={printedReceiptData.idempotencyKey}
                      drag="x"
                      dragConstraints={{ left: -180, right: 180 }}
                      dragElastic={0.25}
                      onDrag={(_, info) => {
                        setReceiptDragX(info.offset.x);
                      }}
                      onDragEnd={(_, info) => {
                        if (Math.abs(info.offset.x) > 50 || Math.abs(info.velocity.x) > 250) {
                          handleTearReceipt();
                        } else {
                          setReceiptDragX(0);
                        }
                      }}
                      initial={{ height: 0, opacity: 0, y: -10 }}
                      animate={
                        isReceiptTorn
                          ? {
                              x: receiptDragX > 0 ? 300 : -300,
                              y: 80,
                              rotate: receiptDragX > 0 ? 40 : -40,
                              opacity: 0,
                              scale: 0.8,
                            }
                          : {
                              height: "auto",
                              opacity: 1,
                              x: 0,
                              y: 0,
                              rotate: receiptDragX * 0.25,
                              scale: 1,
                            }
                      }
                      transition={isReceiptTorn ? { duration: 0.4 } : { type: "spring", stiffness: 300, damping: 20 }}
                      className="w-full max-w-[240px] bg-[#FFF7E6] text-[#2D3A47] p-3 rounded-b-xl border-x-2 border-b-2 border-[#12181f] shadow-2xl font-mono text-[10px] space-y-2 relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
                    >
                      {/* Live Tear Indicator / Perforation Line during drag */}
                      {Math.abs(receiptDragX) > 5 && (
                        <div className="absolute top-0 left-0 right-0 h-2 bg-[#B46A72]/20 border-b-2 border-dashed border-[#B46A72] flex items-center justify-between px-1 z-30">
                          <span className="text-[8px] font-black text-[#B46A72]">✂️ TEARING</span>
                          <span className="text-[8px] font-black text-[#B46A72]">
                            {Math.min(100, Math.round((Math.abs(receiptDragX) / 50) * 100))}%
                          </span>
                        </div>
                      )}

                      {/* Glowing Print Head Bar scanning down while printing */}
                      {printingStage === "printing" && (
                        <motion.div
                          initial={{ top: "0%" }}
                          animate={{ top: "100%" }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute left-0 right-0 h-1 bg-[#B46A72] shadow-[0_0_8px_#B46A72] opacity-80 pointer-events-none"
                        />
                      )}

                      {/* Serrated Top Attachment Edge */}
                      <div className="absolute top-0 left-0 right-0 h-1 border-t-2 border-dashed border-[#2D3A47]/40" />

                      <div className="text-center pb-1 border-b border-dashed border-[#2D3A47]/40 pt-1">
                        <div className="font-extrabold text-[11px] tracking-wider uppercase text-[#B46A72]">
                          TAIPEI TERMINAL #88
                        </div>
                        <div className="text-[9px] text-[#2D3A47]/80">
                          OFFICIAL TRANSACTION RECEIPT
                        </div>
                        <div className="text-[9px] font-bold mt-0.5">
                          BILL NO: {printedReceiptData.billNumber}
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <div className="flex justify-between">
                          <span className="text-[#2D3A47]/70">ITEM:</span>
                          <span className="font-bold truncate max-w-[120px]">
                            {printedReceiptData.desc}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#2D3A47]/70">AMOUNT:</span>
                          <span className="font-black text-[#B46A72]">
                            NT$ {printedReceiptData.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#2D3A47]/70">OWNER:</span>
                          <span className="font-bold">
                            {printedReceiptData.whose === "Mine" ? "CHHAVI" : "Roommate"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#2D3A47]/70">CATEGORY:</span>
                          <span className="font-bold">{printedReceiptData.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#2D3A47]/70">DATE:</span>
                          <span>{printedReceiptData.date}</span>
                        </div>
                      </div>

                      {/* Simulated Barcode */}
                      <div className="pt-1.5 border-t border-dashed border-[#2D3A47]/40 text-center">
                        <div className="h-6 w-full bg-[repeating-linear-gradient(90deg,#2D3A47,#2D3A47_2px,transparent_2px,transparent_4px)] my-1" />
                        <div className="text-[8px] text-[#2D3A47]/60 font-bold tracking-widest">
                          * {printedReceiptData.billNumber} *
                        </div>
                      </div>

                      {/* Tear Off Button */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTearReceipt();
                          }}
                          className="w-full py-1 bg-[#2D3A47] hover:bg-[#182028] text-[#FFF7E6] font-bold text-[9px] rounded transition-all flex items-center justify-center gap-1 cursor-pointer shadow"
                        >
                          <span>TEAR OFF RECEIPT ✂️</span>
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {printingStage === "idle" && (
                <p className="text-[9px] text-[#A9B7C6] mt-1.5">
                  Prints itemized thermal receipts upon submission
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
