
"use client";

import { useEffect, useState } from "react";
import { adminGenerateLandingPageContent } from "@/ai/flows/admin-generate-landing-page-content";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

interface AITaglineProps {
  context: string;
}

export function AITagline({ context }: AITaglineProps) {
  const [tagline, setTagline] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTagline() {
      try {
        const variations = await adminGenerateLandingPageContent({
          context: context,
          numVariations: 1
        });
        if (variations && variations.length > 0) {
          setTagline(variations[0]);
        }
      } catch (error) {
        console.error("Failed to generate AI content", error);
        setTagline("Crafting the future of 3D digital experiences.");
      } finally {
        setLoading(false);
      }
    }

    fetchTagline();
  }, [context]);

  return (
    <div className="min-h-[1.5em] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-lg"
          >
            <Skeleton className="h-4 w-full bg-white/10" />
          </motion.div>
        ) : (
          <motion.p
            key="tagline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground font-medium"
          >
            {tagline}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
