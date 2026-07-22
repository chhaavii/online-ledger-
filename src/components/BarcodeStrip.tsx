import React, { useState } from "react";
import { Transaction } from "../types";
import { Barcode } from "lucide-react";

interface BarcodeStripProps {
  transactions: Transaction[];
}

interface CategoryTotal {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  hoverColor: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; bar: string; hover: string }> = {
  "Groceries": { bg: "bg-[#A8B58A]", text: "text-[#A8B58A]", bar: "#A8B58A", hover: "#c3cfab" },
  "Dining Out": { bg: "bg-[#F7C8D3]", text: "text-[#F7C8D3]", bar: "#F7C8D3", hover: "#ffdee6" },
  "Transport": { bg: "bg-[#A9B7C6]", text: "text-[#A9B7C6]", bar: "#A9B7C6", hover: "#c6d3e1" },
  "Education": { bg: "bg-[#B46A72]", text: "text-[#B46A72]", bar: "#B46A72", hover: "#c77c84" },
  "Housing": { bg: "bg-[#FFF7E6]", text: "text-[#FFF7E6]", bar: "#FFF7E6", hover: "#ffffff" },
  "Utilities": { bg: "bg-[#3e4f60]", text: "text-[#3e4f60]", bar: "#3e4f60", hover: "#50657b" },
  "General": { bg: "bg-[#A9B7C6]", text: "text-[#A9B7C6]", bar: "#A9B7C6", hover: "#c6d3e1" },
};

export const BarcodeStrip: React.FC<BarcodeStripProps> = ({ transactions }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Compute category totals for personal (Mine) spending
  const mineTxs = transactions.filter((t) => t.whose === "Mine");
  const totalMine = mineTxs.reduce((sum, t) => sum + t.amount, 0);

  const categoryMap: Record<string, number> = {};
  for (const tx of mineTxs) {
    const cat = tx.category || "General";
    categoryMap[cat] = (categoryMap[cat] || 0) + tx.amount;
  }

  const categories: CategoryTotal[] = Object.entries(categoryMap)
    .map(([category, amount]) => {
      const info = CATEGORY_COLORS[category] || CATEGORY_COLORS["General"];
      return {
        category,
        amount,
        percentage: totalMine > 0 ? (amount / totalMine) * 100 : 0,
        color: info.bar,
        hoverColor: info.hover,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  if (mineTxs.length === 0) {
    return (
      <div className="bg-[#2D3A47] border-2 border-[#3e4f60] rounded-2xl p-5 text-[#FFF7E6] shadow-xl text-center font-mono text-xs text-[#A9B7C6]">
        No personal transactions recorded yet to generate category barcode.
      </div>
    );
  }

  return (
    <div className="bg-[#2D3A47] border-2 border-[#3e4f60] rounded-2xl p-5 text-[#FFF7E6] shadow-xl space-y-4 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#3e4f60]">
        <div className="flex items-center space-x-2">
          <Barcode className="w-5 h-5 text-[#F7C8D3]" />
          <div>
            <h3 className="text-xs font-bold text-[#F7C8D3] uppercase tracking-widest">
              SPEND BY CATEGORY BARCODE
            </h3>
            <p className="text-xs text-[#A9B7C6]">Visual Category Spectral Breakdown</p>
          </div>
        </div>
        <div className="text-xs text-[#A9B7C6]">
          Total: <span className="font-extrabold text-[#A8B58A]">NT$ {totalMine.toLocaleString()}</span>
        </div>
      </div>

      {/* Interactive Barcode Strip */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-[#A9B7C6]">
          <span>SPEND BARCODE STRIP</span>
          <span>
            {hoveredCategory ? (
              <span className="text-[#F7C8D3] font-bold">
                HOVERING: {hoveredCategory}
              </span>
            ) : (
              "HOVER STRATEGY BARS"
            )}
          </span>
        </div>

        {/* Barcode Canvas / Strip */}
        <div className="w-full h-16 bg-[#182028] rounded-xl p-2.5 border border-[#3e4f60] flex items-center space-x-1 overflow-hidden relative shadow-inner">
          {categories.map((cat) => {
            const numLines = Math.max(3, Math.round((cat.percentage / 100) * 45));
            const isHovered = hoveredCategory === cat.category;

            return (
              <div
                key={cat.category}
                onMouseEnter={() => setHoveredCategory(cat.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                style={{ flexGrow: cat.amount }}
                className="h-full flex items-center space-x-0.5 cursor-pointer px-1 transition-all rounded hover:bg-[#3e4f60]/40"
              >
                {Array.from({ length: numLines }).map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: isHovered ? cat.hoverColor : cat.color,
                      width: idx % 2 === 0 ? "3px" : "1.5px",
                      opacity: isHovered ? 1 : 0.85,
                    }}
                    className="h-full transition-all"
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="space-y-2.5 pt-2">
        {categories.map((cat) => {
          const isHovered = hoveredCategory === cat.category;

          return (
            <div
              key={cat.category}
              onMouseEnter={() => setHoveredCategory(cat.category)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isHovered ? "bg-[#182028]" : "hover:bg-[#182028]/60"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-bold text-[#FFF7E6]">{cat.category}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[#A9B7C6]">
                    NT$ {cat.amount.toLocaleString()}
                  </span>
                  <span className="font-bold text-[#FFF7E6] w-12 text-right">
                    {cat.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-[#182028] rounded-full overflow-hidden border border-[#3e4f60]">
                <div
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color,
                  }}
                  className="h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
