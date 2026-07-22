import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Gamepad2, ArrowRight, ShieldCheck, Play } from "lucide-react";
import { playCardInsertSound, playSuccessChime, playClickSound } from "../utils/audioEffects";

interface IntroScreenProps {
  onCompleteIntro: () => void;
  bgImageUrl: string;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onCompleteIntro, bgImageUrl }) => {
  const [stage, setStage] = useState<"card_display" | "flying" | "bg_fade" | "completed">("card_display");

  const startFlyingAnimation = () => {
    playClickSound();
    playCardInsertSound();
    setStage("flying");

    // Flight sequence timing
    setTimeout(() => {
      setStage("bg_fade");
      playSuccessChime();
    }, 1400);

    setTimeout(() => {
      setStage("completed");
      onCompleteIntro();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1e2730] font-mono text-[#FFF7E6] flex flex-col items-center justify-center overflow-hidden">
      {/* Anime Night Market Street Background - starts heavily blurred & dark, clears up as card flies */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 transform ${
          stage === "card_display"
            ? "blur-xl opacity-30 scale-100 brightness-50"
            : stage === "flying"
            ? "blur-md opacity-60 scale-102 brightness-75 transition-all duration-1000"
            : "blur-none opacity-100 scale-105 brightness-100 transition-all duration-1000"
        }`}
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      />

      {/* Atmospheric Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2D3A47] via-[#2D3A47]/40 to-transparent pointer-events-none" />

      {/* Cyber Grid / Retro Scanline effect */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#F7C8D3_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* HUD Header */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <div className="flex items-center space-x-2 bg-[#2D3A47]/90 backdrop-blur border border-[#B46A72]/40 px-3.5 py-1.5 rounded-xl shadow-lg">
          <Gamepad2 className="w-4 h-4 text-[#F7C8D3] animate-pulse" />
          <span className="text-xs font-bold text-[#FFF7E6] tracking-widest uppercase">
            TAIPEI LEDGER • CHHAVI
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            onCompleteIntro();
          }}
          className="text-xs bg-[#2D3A47]/90 hover:bg-[#3b4b5a] text-[#A9B7C6] hover:text-[#FFF7E6] border border-[#3e4f60] px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow"
        >
          SKIP INTRO <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Stage Container */}
      <div className="relative z-10 max-w-lg w-full px-6 flex flex-col items-center text-center">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="inline-flex items-center space-x-2 bg-[#B46A72]/20 border border-[#B46A72]/50 px-3 py-1 rounded-full text-[11px] text-[#F7C8D3] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#F7C8D3]" />
            <span>DOUBLE-ENTRY BOOKKEEPING ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#FFF7E6] drop-shadow-[0_0_20px_rgba(247,200,211,0.4)]">
            ONLINE LEDGER
          </h1>
          <p className="text-xs text-[#A9B7C6] mt-1.5 font-mono">
            TAIPEI STUDENT EDITION • EASYCARD INTEGRATION
          </p>
        </motion.div>

        {/* Floating / Orbiting Credit Card Display Component */}
        <div className="relative w-80 h-52 my-2 perspective-1000 flex items-center justify-center">
          <AnimatePresence>
            <motion.div
              key="chhavi-credit-card"
              initial={{ rotateX: 15, rotateY: -15, scale: 0.9, opacity: 0 }}
              animate={
                stage === "card_display"
                  ? {
                      rotateX: [12, -12, 12],
                      rotateY: [-12, 12, -12],
                      y: [-10, 10, -10],
                      scale: 1,
                      opacity: 1,
                    }
                  : stage === "flying"
                  ? {
                      // Flight path: flies out in 3D circle/swoop, flips around, then dives straight into the slot
                      x: [0, 120, -120, 0, 0],
                      y: [0, -60, -100, 40, 160],
                      scale: [1, 1.3, 0.9, 0.6, 0.1],
                      rotateX: [0, 360, 720, 90, 90],
                      rotateY: [0, 180, 360, 0, 0],
                      rotateZ: [0, -45, 45, 0, 0],
                      opacity: [1, 1, 1, 0.8, 0],
                    }
                  : { opacity: 0, scale: 0 }
              }
              transition={
                stage === "card_display"
                  ? { repeat: Infinity, duration: 5, ease: "easeInOut" }
                  : { duration: 2.2, ease: "easeInOut", times: [0, 0.3, 0.6, 0.85, 1] }
              }
              className="w-80 h-48 rounded-2xl bg-gradient-to-br from-[#2D3A47] via-[#3b4b5a] to-[#B46A72] p-5 text-[#FFF7E6] shadow-[0_12px_40px_rgba(180,106,114,0.4)] border-2 border-[#F7C8D3]/50 flex flex-col justify-between relative overflow-hidden backdrop-blur-md"
            >
              {/* Card Hologram shimmer lines */}
              <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-[#F7C8D3]/20 rounded-full blur-2xl pointer-events-none" />

              {/* Card Top Row */}
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center space-x-2">
                  {/* EMV Chip */}
                  <div className="w-9 h-7 rounded-md bg-gradient-to-br from-[#FFF7E6] via-[#F7C8D3] to-[#B46A72] border border-[#F7C8D3] shadow-inner flex flex-col justify-around p-0.5">
                    <div className="h-0.5 bg-[#B46A72]/60 w-full" />
                    <div className="h-0.5 bg-[#B46A72]/60 w-full" />
                  </div>
                  <div className="text-[10px] font-mono leading-tight text-left">
                    <div className="font-bold text-[#FFF7E6]">TAIWAN STUDENT ID</div>
                    <div className="text-[#A9B7C6]">EASYCARD PASS</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold tracking-widest text-[#FFF7E6] bg-[#2D3A47]/80 px-2.5 py-0.5 rounded border border-[#B46A72]/50">
                    VISA
                  </span>
                </div>
              </div>

              {/* Card Number */}
              <div className="relative z-10 my-2 text-left">
                <div className="font-mono text-base tracking-[0.25em] text-[#FFF7E6] drop-shadow">
                  4882 •••• •••• 9910
                </div>
              </div>

              {/* Cardholder Name & Expiry */}
              <div className="flex items-end justify-between relative z-10 border-t border-[#F7C8D3]/30 pt-2">
                <div className="text-left">
                  <div className="text-[9px] font-mono text-[#A9B7C6] uppercase tracking-wider">
                    CARDHOLDER
                  </div>
                  <div className="text-base font-extrabold font-mono tracking-widest text-[#F7C8D3] drop-shadow-[0_0_10px_rgba(247,200,211,0.8)]">
                    CHHAVI
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[9px] font-mono text-[#A9B7C6] uppercase tracking-wider">
                    VALID THRU
                  </div>
                  <div className="text-xs font-mono font-bold text-[#FFF7E6]">08/28</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Button */}
        {stage === "card_display" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-3 w-full"
          >
            <button
              type="button"
              onClick={startFlyingAnimation}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#B46A72] via-[#F7C8D3] to-[#B46A72] hover:from-[#c2767e] hover:to-[#F7C8D3] text-[#2D3A47] font-extrabold font-mono tracking-wider text-sm rounded-xl shadow-[0_0_25px_rgba(180,106,114,0.5)] transition-all flex items-center justify-center space-x-2 group cursor-pointer border border-[#FFF7E6]/40"
            >
              <Play className="w-4 h-4 fill-[#2D3A47] group-hover:scale-110 transition-transform" />
              <span>FLY CHHAVI'S CARD & INSERT INTO ATM</span>
            </button>

            <div className="text-[11px] text-[#A9B7C6] font-mono flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A8B58A]" />
              <span>GAAP Double-Entry Balance • Idempotency Secured</span>
            </div>
          </motion.div>
        )}

        {/* Transition Status Message */}
        {(stage === "flying" || stage === "bg_fade") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 bg-[#2D3A47]/95 border-2 border-[#B46A72] rounded-2xl shadow-2xl backdrop-blur"
          >
            <div className="flex items-center justify-center space-x-2 text-[#F7C8D3] text-xs font-bold font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F7C8D3] animate-ping" />
              <span>FLYING CARD IN 3D ORBIT & UNBLURRING STREET...</span>
            </div>
            <p className="text-[11px] text-[#A9B7C6] mt-1.5 font-mono">
              Inserting card into Taipei Night Market ATM Terminal...
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
