import React from "react";
import {
  CreditCard,
  Receipt,
  Scale,
  Users,
  Barcode,
  Tag,
  Server,
  Volume2,
  VolumeX,
  Tv,
  Play,
  X,
  ChevronRight,
  Gamepad2,
  Sparkles,
} from "lucide-react";
import { playClickSound } from "../utils/audioEffects";

export type NavView = "atm" | "roll" | "audit" | "iou" | "barcode" | "keywords";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: NavView;
  onSelectView: (view: NavView) => void;
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
  onTriggerIntroAnimation: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeView,
  onSelectView,
  scanlinesEnabled,
  onToggleScanlines,
  onTriggerIntroAnimation,
  soundOn,
  onToggleSound,
}) => {
  if (!isOpen) return null;

  const navItems = [
    {
      id: "atm" as NavView,
      label: "ATM Terminal (Home)",
      desc: "Card insert & transaction printer",
      icon: CreditCard,
      color: "text-[#F7C8D3] border-[#B46A72]/40 bg-[#B46A72]/20",
    },
    {
      id: "roll" as NavView,
      label: "Thermal Receipt Roll",
      desc: "Stacked history of printed bills",
      icon: Receipt,
      color: "text-[#FFF7E6] border-[#FFF7E6]/40 bg-[#FFF7E6]/10",
    },
    {
      id: "audit" as NavView,
      label: "Ledger Engine Audit",
      desc: "Double-entry GAAP equilibrium check",
      icon: Scale,
      color: "text-[#A8B58A] border-[#A8B58A]/40 bg-[#A8B58A]/20",
    },
    {
      id: "iou" as NavView,
      label: "Roommate IOU Tracker",
      desc: "Fronted expenses & reimbursement",
      icon: Users,
      color: "text-[#F7C8D3] border-[#F7C8D3]/40 bg-[#F7C8D3]/20",
    },
    {
      id: "barcode" as NavView,
      label: "Category Barcode & Stats",
      desc: "Visual spectral category breakdown",
      icon: Barcode,
      color: "text-[#A9B7C6] border-[#A9B7C6]/40 bg-[#A9B7C6]/20",
    },
    {
      id: "keywords" as NavView,
      label: "Keyword Auto-Router",
      desc: "Longest-match categorization rules",
      icon: Tag,
      color: "text-[#F7C8D3] border-[#B46A72]/40 bg-[#B46A72]/20",
    },
  ];

  const handleNavClick = (view: NavView) => {
    playClickSound();
    onSelectView(view);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex font-mono">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className="relative w-80 max-w-[85vw] bg-[#2D3A47] border-r-2 border-[#3e4f60] text-[#FFF7E6] flex flex-col justify-between shadow-2xl z-10 overflow-hidden">
        
        {/* Header HUD */}
        <div>
          <div className="p-4 bg-[#1e2730] border-b border-[#3e4f60] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#B46A72]/30 border border-[#F7C8D3]/50 flex items-center justify-center text-[#F7C8D3]">
                <Gamepad2 className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#F7C8D3]">
                  SYSTEM MENU
                </h2>
                <p className="text-[10px] text-[#A9B7C6]">PLAYER: CHHAVI</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#2D3A47] hover:bg-[#3b4b5a] text-[#A9B7C6] hover:text-[#FFF7E6] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Player Stats HUD */}
          <div className="p-3 bg-[#182028] border-b border-[#3e4f60] text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#A9B7C6]">
              <span className="flex items-center gap-1 text-[#FFF7E6] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#F7C8D3]" /> STUDENT LEVEL 88
              </span>
              <span className="text-[#A8B58A] font-bold">TAIPEI EASYCARD</span>
            </div>

            {/* Simulated Energy Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#A9B7C6]">
                <span>EXP / LEDGER SYNCHRONIZED</span>
                <span>100%</span>
              </div>
              <div className="w-full h-1.5 bg-[#12181f] rounded-full overflow-hidden border border-[#3e4f60]">
                <div className="h-full bg-gradient-to-r from-[#B46A72] to-[#F7C8D3] w-full" />
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-1.5 max-h-[52vh] overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? "bg-[#182028] border-[#B46A72] text-[#F7C8D3] shadow-[0_0_15px_rgba(180,106,114,0.3)] font-bold"
                      : "bg-[#1e2730]/60 border-[#3e4f60]/80 hover:bg-[#1e2730] hover:border-[#B46A72]/50 text-[#FFF7E6]"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">{item.label}</div>
                      <div className="text-[10px] text-[#A9B7C6] leading-tight mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "text-[#F7C8D3] translate-x-0.5" : "text-[#3e4f60]"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Toggles & Intro Trigger */}
        <div className="p-4 bg-[#1e2730] border-t border-[#3e4f60] space-y-2.5">
          {/* Replay Intro Button */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onTriggerIntroAnimation();
              onClose();
            }}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-[#B46A72] via-[#F7C8D3] to-[#B46A72] hover:from-[#c2767e] text-[#2D3A47] font-black text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-2 cursor-pointer border border-[#FFF7E6]/30"
          >
            <Play className="w-3.5 h-3.5 fill-[#2D3A47]" />
            <span>PLAY FLYING CARD INTRO</span>
          </button>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Retro Sound FX Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              className={`p-2 rounded-xl border flex items-center justify-center space-x-1.5 text-xs transition-colors cursor-pointer ${
                soundOn
                  ? "bg-[#B46A72]/20 border-[#B46A72] text-[#F7C8D3]"
                  : "bg-[#182028] border-[#3e4f60] text-[#A9B7C6]"
              }`}
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundOn ? "SFX: ON" : "SFX: OFF"}</span>
            </button>

            {/* CRT Scanline Toggle */}
            <button
              type="button"
              onClick={onToggleScanlines}
              className={`p-2 rounded-xl border flex items-center justify-center space-x-1.5 text-xs transition-colors cursor-pointer ${
                scanlinesEnabled
                  ? "bg-[#A8B58A]/20 border-[#A8B58A] text-[#A8B58A]"
                  : "bg-[#182028] border-[#3e4f60] text-[#A9B7C6]"
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>{scanlinesEnabled ? "CRT: ON" : "CRT: OFF"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
