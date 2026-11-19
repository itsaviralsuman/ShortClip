import React from 'react';
import { X, Check, Scissors, Sparkles, Wand2, Type, Maximize2, Flame, Plus } from 'lucide-react';
import { OPUS_RECIPES, OpusRecipe } from '../../data/opusRecipes';

interface OpusRecipesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecipeId: string;
  onSelectRecipe: (recipeId: string) => void;
}

export const OpusRecipesModal: React.FC<OpusRecipesModalProps> = ({
  isOpen,
  onClose,
  selectedRecipeId,
  onSelectRecipe
}) => {
  if (!isOpen) return null;

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'Scissors': return <Scissors className="w-5 h-5 text-purple-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-emerald-400" />;
      case 'Wand2': return <Wand2 className="w-5 h-5 text-blue-400" />;
      case 'Type': return <Type className="w-5 h-5 text-amber-400" />;
      case 'Maximize2': return <Maximize2 className="w-5 h-5 text-pink-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-yellow-400" />;
      default: return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#18181b] border border-slate-700 p-4 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Manage Recipes</h3>
            <p className="text-[11px] sm:text-xs text-slate-400">Save your auto-edit Recipes for repeat use.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Action bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3.5 mb-3">
          <div className="flex items-center gap-3">
            <button className="text-xs font-bold text-white border-b-2 border-purple-500 pb-1">
              OpusClip Recipes
            </button>
            <button className="text-xs font-medium text-slate-400 hover:text-slate-200 pb-1">
              My custom Recipes
            </button>
          </div>

          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-[#27272a] hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create new Recipe</span>
          </button>
        </div>

        {/* Recipes Grid matching Screenshot 5 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {OPUS_RECIPES.map((r) => {
            const isSelected = selectedRecipeId === r.id;
            return (
              <div
                key={r.id}
                onClick={() => onSelectRecipe(r.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/15'
                    : 'border-slate-800 bg-[#27272a]/70 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-black/40 border border-slate-700">
                      {renderIcon(r.icon)}
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        In use
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1">{r.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-3">
                    {r.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">{r.tag}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRecipe(r.id);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition ${
                      isSelected
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Use'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-purple text-white hover:bg-purple-600 transition"
          >
            Confirm Recipe
          </button>
        </div>
      </div>
    </div>
  );
};
