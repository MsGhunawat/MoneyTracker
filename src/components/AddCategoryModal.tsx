import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface AddCategoryModalProps {
  showAddCategoryModal: boolean;
  setShowAddCategoryModal: (show: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  availableIcons: any[];
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  handleAddCategory: () => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  showAddCategoryModal,
  setShowAddCategoryModal,
  newCategoryName,
  setNewCategoryName,
  availableIcons,
  selectedIcon,
  setSelectedIcon,
  handleAddCategory,
}) => {
  return (
    <AnimatePresence>
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-5"
          >
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Add Custom Category</h3>
            
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Category Name</label>
                <input 
                  type="text" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Gym" 
                  className="w-full bg-transparent border-none p-0 font-bold text-slate-800 focus:ring-0 placeholder:text-slate-300 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">Select Icon</label>
                <div className="grid grid-cols-4 gap-2">
                  {availableIcons.map((item) => (
                    <button 
                      key={item.name}
                      onClick={() => setSelectedIcon(item.name)}
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center transition-all",
                        selectedIcon === item.name ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-slate-50 text-slate-400"
                      )}
                    >
                      <item.icon size={18} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setShowAddCategoryModal(false)}
                className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddCategory}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
              >
                Add
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
