
"use client";

import { useEffect, useRef } from "react";
import { useStoryStore } from "@/lib/store";
import { CHAPTERS } from "@/lib/story-config";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export function StorySections() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setChapter, setProgress } = useStoryStore();

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);
          
          // Map progress to chapters
          const chapterIndex = Math.min(
            Math.floor(p * CHAPTERS.length),
            CHAPTERS.length - 1
          );
          setChapter(chapterIndex);
        },
      });
    });

    return () => ctx.revert();
  }, [setChapter, setProgress]);

  return (
    <div ref={containerRef} className="relative z-10 no-scrollbar pointer-events-none">
      {CHAPTERS.map((chapter, i) => (
        <section key={chapter.id} className="narrative-panel pointer-events-none">
          <div className="max-w-3xl pointer-events-none">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ amount: 0.5 }}
              className="pointer-events-none"
            >
              <span className="chapter-number">Experience {i + 1}</span>
              <h2 className="chapter-title">{chapter.title}</h2>
              <div className="space-y-4">
                {chapter.narrative.map((line, li) => (
                  <p key={li} className="chapter-text">{line}</p>
                ))}
              </div>
              
              <div className="mt-12">
                <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-xs font-black uppercase tracking-widest transition-all hover:scale-105 pointer-events-auto active:scale-95">
                  Engage
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* Footer / CTA Section */}
      <section className="narrative-panel items-center text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass-panel max-w-2xl pointer-events-auto"
        >
          <h2 className="text-4xl font-black mb-6">Masterpiece Complete.</h2>
          <p className="text-muted-foreground mb-10">
            You've witnessed the evolution from a silent thought to a refined artifact. 
            The journey of creation is infinite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-10 py-5 bg-primary text-primary-foreground font-black rounded-xl hover:opacity-90 transition-opacity"
            >
              Restart Narrative
            </button>
            <button className="px-10 py-5 bg-white/5 border border-white/10 font-black rounded-xl hover:bg-white/10 transition-colors">
              Explore Technicals
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
