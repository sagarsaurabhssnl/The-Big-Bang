
"use client";

import { useStoryStore } from "@/lib/store";
import { CHAPTERS } from "@/lib/story-config";
import { motion } from "framer-motion";
import { EyeOff, Eye, Volume2, Info } from "lucide-react";

export function HUD() {
  const { currentChapter, progress, reducedMotion, toggleReducedMotion, isInteracting } = useStoryStore();
  
  const currentChapterData = CHAPTERS[currentChapter];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-6 md:p-10">
      {/* Top Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tighter">THE IDEA</h1>
          <p className="text-[10px] font-bold tracking-[0.2em] opacity-40 uppercase">A Story of Formation</p>
        </div>
        
        <div className="flex space-x-4 pointer-events-auto">
          <button 
            onClick={toggleReducedMotion}
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            title="Toggle Reduced Motion"
          >
            {reducedMotion ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Volume2 size={18} />
          </button>
        </div>
      </div>

      {/* Center Prompt Hint */}
      {!isInteracting && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <div className="flex flex-col items-center space-y-4">
             <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary to-transparent" />
             <p className="text-xs font-black uppercase tracking-[0.3em] opacity-60">Drag to Interact</p>
          </div>
        </motion.div>
      )}

      {/* Bottom Footer */}
      <div className="flex justify-between items-end">
        <div className="max-w-xs space-y-4">
          <div className="space-y-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Chapter {currentChapter + 1}</p>
            <p className="text-2xl font-black tracking-tight">{currentChapterData.title}</p>
          </div>
          
          <div className="flex items-center space-x-3 pointer-events-auto">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Info size={14} className="text-primary" />
            </div>
            <p className="text-xs font-bold opacity-60 italic">{currentChapterData.prompt}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-1 h-32 bg-white/10 relative rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 w-full bg-primary"
            animate={{ height: `${progress * 100}%` }}
            transition={{ type: 'spring', damping: 20 }}
          />
        </div>
      </div>
    </div>
  );
}
