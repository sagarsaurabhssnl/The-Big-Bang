"use client";

import { useStoryStore } from "@/lib/store";
import { CHAPTERS } from "@/lib/story-config";
import { motion } from "framer-motion";
import { EyeOff, Eye, Volume2 } from "lucide-react";

export function HUD() {
  const { currentChapter, progress, reducedMotion, toggleReducedMotion } = useStoryStore();
  
  const currentChapterData = CHAPTERS[currentChapter];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-6 md:p-10">
      {/* Top Header */}
      <div className="flex justify-between items-start pointer-events-none">
        <div className="space-y-1 pointer-events-none">
          <h1 className="text-2xl font-black tracking-tighter pointer-events-none">THE IDEA</h1>
          <p className="text-[10px] font-bold tracking-[0.2em] opacity-40 uppercase pointer-events-none">A Story of Formation</p>
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

      {/* Bottom Footer */}
      <div className="flex justify-between items-end pointer-events-none">
        <div className="max-w-xs space-y-4 pointer-events-none">
          <div className="space-y-0 pointer-events-none">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 pointer-events-none">Chapter {currentChapter + 1}</p>
            <p className="text-2xl font-black tracking-tight pointer-events-none">{currentChapterData.title}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-1 h-32 bg-white/10 relative rounded-full overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-0 left-0 w-full bg-primary pointer-events-none"
            animate={{ height: `${progress * 100}%` }}
            transition={{ type: 'spring', damping: 20 }}
          />
        </div>
      </div>
    </div>
  );
}
