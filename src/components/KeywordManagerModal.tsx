import React, { useState } from "react";
import { KeywordPair } from "../types";
import { categorizeDescription } from "../ledgerEngine";
import { X, Tag, Plus, Trash2, Search, Sparkles, Check } from "lucide-react";
import { playClickSound } from "../utils/audioEffects";

interface KeywordManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  keywords: KeywordPair[];
  onSaveKeywords: (newKeywords: KeywordPair[]) => Promise<void>;
}

export const KeywordManagerModal: React.FC<KeywordManagerModalProps> = ({
  isOpen,
  onClose,
  keywords,
  onSaveKeywords,
}) => {
  const [list, setList] = useState<KeywordPair[]>(keywords);
  const [search, setSearch] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [newCategory, setNewCategory] = useState("Dining Out");
  const [testText, setTestText] = useState("I bought 7-11 bento and boba at the night market");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const testResultCategory = categorizeDescription(testText, list);

  const handleAddPair = () => {
    playClickSound();
    if (!newKeyword.trim() || !newCategory.trim()) return;
    const kwClean = newKeyword.trim();
    const catClean = newCategory.trim();

    if (list.some(([k]) => k.toLowerCase() === kwClean.toLowerCase())) {
      alert(`Keyword "${kwClean}" already exists!`);
      return;
    }

    const updated = [[kwClean, catClean] as KeywordPair, ...list];
    setList(updated);
    setNewKeyword("");
  };

  const handleDeletePair = (indexToDelete: number) => {
    playClickSound();
    const updated = list.filter((_, idx) => idx !== indexToDelete);
    setList(updated);
  };

  const handleSave = async () => {
    playClickSound();
    setIsSaving(true);
    await onSaveKeywords(list);
    setIsSaving(false);
    onClose();
  };

  const filteredList = list.filter(
    ([kw, cat]) =>
      kw.toLowerCase().includes(search.toLowerCase()) ||
      cat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto font-mono">
      <div className="bg-[#2D3A47] border-2 border-[#3e4f60] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-[#FFF7E6]">
        {/* Header */}
        <div className="bg-[#182028] px-6 py-4 border-b border-[#3e4f60] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#B46A72]/20 border border-[#B46A72]/50 text-[#F7C8D3]">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#FFF7E6] uppercase tracking-wider">
                AUTO-CATEGORIZATION KEYWORDS
              </h2>
              <p className="text-xs text-[#A9B7C6]">
                Longest-match keyword routing engine ({list.length} rules)
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

        {/* Live Matching Test Playground */}
        <div className="p-4 bg-[#1e2730] border-b border-[#3e4f60] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A9B7C6]">
            <span className="flex items-center gap-1.5 text-[#F7C8D3] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#F7C8D3]" /> TEST AUTO-MATCHING ENGINE
            </span>
            <span className="text-[10px] text-[#A9B7C6]">Longest Keyword Match Strategy</span>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Type sample transaction description..."
              className="flex-1 bg-[#182028] border border-[#3e4f60] rounded-xl px-3 py-1.5 text-xs text-[#FFF7E6] focus:outline-none focus:border-[#F7C8D3]"
            />
            <div className="px-3 py-1.5 rounded-xl bg-[#A8B58A]/20 border border-[#A8B58A]/50 text-[#A8B58A] text-xs font-extrabold whitespace-nowrap">
              ➔ Category: {testResultCategory}
            </div>
          </div>
        </div>

        {/* Add New Rule */}
        <div className="p-4 border-b border-[#3e4f60] bg-[#2D3A47] flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="New keyword (e.g. night market, YouBike)"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            className="flex-1 min-w-[180px] bg-[#182028] border border-[#3e4f60] rounded-xl px-3 py-2 text-xs text-[#FFF7E6] focus:outline-none focus:border-[#F7C8D3]"
          />

          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="bg-[#182028] border border-[#3e4f60] rounded-xl px-3 py-2 text-xs text-[#FFF7E6] focus:outline-none focus:border-[#F7C8D3] cursor-pointer"
          >
            <option value="Dining Out">Dining Out</option>
            <option value="Groceries">Groceries</option>
            <option value="Transport">Transport</option>
            <option value="Education">Education</option>
            <option value="Housing">Housing</option>
            <option value="Utilities">Utilities</option>
            <option value="Telecom">Telecom</option>
            <option value="Entertainment">Entertainment</option>
            <option value="General">General</option>
          </select>

          <button
            type="button"
            onClick={handleAddPair}
            disabled={!newKeyword.trim()}
            className="px-4 py-2 bg-[#B46A72] hover:bg-[#c2767e] disabled:opacity-50 text-[#FFF7E6] font-extrabold text-xs rounded-xl transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Rule</span>
          </button>
        </div>

        {/* Rules Table */}
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#A9B7C6]" />
            <input
              type="text"
              placeholder="Search keywords or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#182028] border border-[#3e4f60] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#FFF7E6] focus:outline-none focus:border-[#F7C8D3]"
            />
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {filteredList.map(([kw, cat], idx) => (
              <div
                key={`${kw}-${idx}`}
                className="bg-[#182028] p-2.5 rounded-xl border border-[#3e4f60] flex items-center justify-between text-xs hover:border-[#B46A72] transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-[#A8B58A]">"{kw}"</span>
                  <span className="text-[#A9B7C6]">➔</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#2D3A47] text-[#FFF7E6] border border-[#3e4f60] text-[11px]">
                    {cat}
                  </span>
                  <span className="text-[10px] text-[#A9B7C6]">({kw.length} chars)</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeletePair(idx)}
                  className="p-1 text-[#A9B7C6] hover:text-[#B46A72] hover:bg-[#B46A72]/10 rounded transition-colors cursor-pointer"
                  title="Remove rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#182028] px-6 py-3 border-t border-[#3e4f60] flex items-center justify-between text-xs">
          <span className="text-[#A9B7C6]">Keywords matched by specificity length descending</span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="px-4 py-2 bg-[#2D3A47] hover:bg-[#3b4b5a] text-[#FFF7E6] font-bold rounded-xl transition-colors cursor-pointer border border-[#3e4f60]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-[#B46A72] hover:bg-[#c2767e] text-[#FFF7E6] font-extrabold rounded-xl transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Keywords"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
