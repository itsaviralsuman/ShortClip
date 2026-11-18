import React, { useState } from 'react';
import { X, Check, Smartphone, Monitor, Square, SmartphoneCharging, LayoutGrid, Users, Video } from 'lucide-react';
import { OPUS_LAYOUTS, OpusLayoutItem } from '../../data/opusLayouts';
import { AspectRatio } from '../../types';

interface OpusLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAspectRatio: AspectRatio;
  onSelectAspectRatio: (ratio: AspectRatio) => void;
  activeLayoutIds: string[];
  onToggleLayoutId: (id: string) => void;
}

export const OpusLayoutModal: React.FC<OpusLayoutModalProps> = ({
  isOpen,
  onClose,
  selectedAspectRatio,
  onSelectAspectRatio,
  activeLayoutIds,
  onToggleLayoutId
}) => {
  if (!isOpen) return null;

  const ratios: { id: AspectRatio; label: string; icon: React.ReactNode }[] = [
    { id: '9:16', label: '9:16', icon: <Smartphone className="w-5 h-5 text-purple-400" /> },
    { id: '16:9', label: '16:9', icon: <Monitor className="w-5 h-5 text-purple-400" /> },
    { id: '1:1', label: '1:1', icon: <Square className="w-5 h-5 text-purple-400" /> },
    { id: '4:5', label: '4:5', icon: <SmartphoneCharging className="w-5 h-5 text-purple-400" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#18181b] border border-slate-700 p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Choose Layouts</h3>
            <p className="text-xs text-slate-400">Select aspect ratios and AI auto-reframing presets</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Aspect Ratio Cards */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-300 block mb-2">Aspect Ratio</label>
          <div className="grid grid-cols-4 gap-2.5">
            {ratios.map((r) => {
              const isSelected = selectedAspectRatio === r.id;
              return (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => onSelectAspectRatio(r.id)}
                  className={`relative p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                      : 'border-slate-800 bg-[#27272a] hover:border-slate-700'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                  {r.icon}
                  <span className="text-xs font-bold text-white">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Layouts AI Can Use (Fill, Fit, Split, Three, Four, ScreenShare, Gameplay) */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300">Layouts AI can use</label>
            <span className="text-[10px] text-slate-500">Auto-detected per scene</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {OPUS_LAYOUTS.map((layout) => {
              const isChecked = activeLayoutIds.includes(layout.id);
              return (
                <div
                  key={layout.id}
                  onClick={() => onToggleLayoutId(layout.id)}
                  className={`relative p-2.5 rounded-xl border cursor-pointer transition flex flex-col items-center justify-between min-h-[96px] ${
                    isChecked
                      ? 'border-purple-500/80 bg-purple-500/10'
                      : 'border-slate-800 bg-[#27272a]/60 opacity-60'
                  }`}
                >
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">
                    {isChecked && <Check className="w-3 h-3 text-purple-400 stroke-[3]" />}
                  </div>

                  {/* Visual mockup of the layout */}
                  <div className="w-10 h-10 rounded-lg bg-black/50 border border-slate-700/80 flex items-center justify-center mb-1">
                    {layout.iconType === 'fill' && <div className="w-6 h-8 rounded bg-purple-400/80" />}
                    {layout.iconType === 'fit' && (
                      <div className="w-6 h-8 rounded bg-purple-900/40 border border-purple-400 flex items-center justify-center">
                        <div className="w-6 h-4 bg-purple-400" />
                      </div>
                    )}
                    {layout.iconType === 'split' && (
                      <div className="w-6 h-8 flex flex-col gap-0.5">
                        <div className="flex-1 bg-purple-400 rounded-t" />
                        <div className="flex-1 bg-pink-400 rounded-b" />
                      </div>
                    )}
                    {layout.iconType === 'three' && (
                      <div className="w-6 h-8 flex flex-col gap-0.5">
                        <div className="h-4 bg-purple-400 rounded-t" />
                        <div className="flex-1 flex gap-0.5">
                          <div className="flex-1 bg-emerald-400 rounded-bl" />
                          <div className="flex-1 bg-cyan-400 rounded-br" />
                        </div>
                      </div>
                    )}
                    {layout.iconType === 'four' && (
                      <div className="w-6 h-8 grid grid-cols-2 gap-0.5 p-0.5">
                        <div className="bg-purple-400 rounded-tl" />
                        <div className="bg-amber-400 rounded-tr" />
                        <div className="bg-emerald-400 rounded-bl" />
                        <div className="bg-pink-400 rounded-br" />
                      </div>
                    )}
                    {layout.iconType === 'screenshare' && (
                      <div className="w-6 h-8 flex flex-col gap-0.5">
                        <div className="h-3 bg-purple-400 rounded-t" />
                        <div className="flex-1 bg-blue-600 rounded-b p-0.5 flex items-center justify-center text-[6px]">
                          PDF
                        </div>
                      </div>
                    )}
                    {layout.iconType === 'gameplay' && (
                      <div className="w-6 h-8 flex flex-col gap-0.5">
                        <div className="h-2.5 bg-purple-400 rounded-t" />
                        <div className="flex-1 bg-emerald-700 rounded-b flex items-center justify-center text-[6px]">
                          GAME
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-white text-center">{layout.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-purple text-white hover:bg-purple-600 transition"
          >
            Apply Layouts
          </button>
        </div>
      </div>
    </div>
  );
};
