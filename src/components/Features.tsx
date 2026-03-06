
import { Layers, Zap, Users, Shield, Cpu, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

const features = [
  {
    title: "Interactive 3D Engine",
    description: "Built on top of React Three Fiber, SceneCraft provides a highly optimized, stateful engine for complex 3D scenes.",
    icon: Cpu,
  },
  {
    title: "Real-time Collaboration",
    description: "Design with your team in real-time. Share scenes instantly and iterate faster than ever before.",
    icon: Users,
  },
  {
    title: "Vibrant Artistry",
    description: "Advanced shader support and post-processing tools allow you to achieve any aesthetic from low-poly to photoreal.",
    icon: Layers,
  },
  {
    title: "Edge Performance",
    description: "Scenes are optimized for mobile and low-end devices automatically using intelligent mesh decimation.",
    icon: Zap,
  },
  {
    title: "Global Distribution",
    description: "Host your interactive experiences on our global CDN with one-click deployment and zero configuration.",
    icon: Globe,
  },
  {
    title: "Enterprise Security",
    description: "Your intellectual property is protected with end-to-end encryption and granular access controls.",
    icon: Shield,
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-headline">Redefining Digital Space</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to build, collaborate on, and deploy interactive 3D experiences for the modern web.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Card key={idx} className="bg-card/50 border-white/5 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-24 space-y-24">
          {/* Detailed Feature 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
                Precision Design
              </div>
              <h3 className="text-3xl md:text-4xl font-bold font-headline">Visual Logic for Creative Minds</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Connect components visually or dive deep into the code. Our hybrid workflow ensures that artists and engineers speak the same language, eliminating the friction in 3D production.
              </p>
              <ul className="space-y-3">
                {['Node-based material editor', 'Custom GLSL shader support', 'Interactive animation timelines'].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-muted-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 relative">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-30" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video shadow-2xl">
                <Image 
                  src={PlaceHolderImages[0].imageUrl} 
                  alt={PlaceHolderImages[0].description}
                  fill
                  className="object-cover"
                  data-ai-hint={PlaceHolderImages[0].imageHint}
                />
              </div>
            </div>
          </div>

          {/* Detailed Feature 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                Workflow Unity
              </div>
              <h3 className="text-3xl md:text-4xl font-bold font-headline">Sync Your Entire Ecosystem</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Bridge the gap between your design tools and the web. SceneCraft integrates with Blender, Figma, and Cinema 4D, allowing for seamless asset pipelines.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-2xl font-bold text-white mb-1">90%</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-tight">Reduction in pipeline overhead</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-2xl font-bold text-white mb-1">4K</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-tight">Real-time texture streaming</p>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute -inset-4 bg-accent/20 blur-3xl rounded-full opacity-30" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video shadow-2xl">
                <Image 
                  src={PlaceHolderImages[1].imageUrl} 
                  alt={PlaceHolderImages[1].description}
                  fill
                  className="object-cover"
                  data-ai-hint={PlaceHolderImages[1].imageHint}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
