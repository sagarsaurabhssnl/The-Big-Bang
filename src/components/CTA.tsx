
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-b from-card to-background rounded-3xl p-12 md:p-20 text-center border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/20 blur-[100px] rounded-full" />
          
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight font-headline">
            Ready to Build Your <br />
            <span className="text-primary">Masterpiece?</span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of creators pushing the boundaries of what is possible on the web. Start your 14-day free trial today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 h-16 font-bold group w-full sm:w-auto">
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/5 text-lg px-10 h-16 w-full sm:w-auto">
              Contact Sales
            </Button>
          </div>
          
          <p className="mt-8 text-sm text-muted-foreground">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
