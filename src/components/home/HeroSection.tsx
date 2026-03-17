import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePublicContent } from "@/contexts/PublicContentContext";

export const HeroSection = () => {
  const { content } = usePublicContent();
  const galleryImages = content.heroImages;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (galleryImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [galleryImages.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  return (
    <section id="arena" className="relative h-[55vh] min-h-[360px] lg:h-[70vh] overflow-hidden">
      {/* Background Slider */}
      {galleryImages.map((img, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-all duration-700",
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
        >
          <img src={img} alt={`Gaming setup ${index + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}

      {galleryImages.length === 0 && <div className="absolute inset-0 bg-surface-2" />}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(185 85% 48% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(185 85% 48% / 0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Hero Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 lg:p-12 lg:pb-16">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-primary animate-pulse-neon" />
            <span className="text-xs font-heading font-semibold text-primary uppercase tracking-widest">Premium Gaming Arena</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-3 leading-tight tracking-tight">
            <span className="text-white">Level Up Your </span>
            <span className="text-gradient">Gaming</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-lg mb-6 font-body">
            Premium PCs, PlayStation & Xbox consoles — Tiruppur's ultimate gaming destination.
          </p>
          
          {/* Dual CTA */}
          <div className="flex flex-wrap gap-3">
            <Link to="/booking">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground font-heading font-semibold px-6 py-6 rounded-xl text-base neon-glow hover:scale-[1.02] transition-transform">
                Book a Slot
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white font-heading font-semibold px-6 py-6 rounded-xl text-base hover:bg-white/5"
              onClick={() => {
                document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Explore Arena
            </Button>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute top-1/2 -translate-y-1/2 left-3 right-3 flex justify-between pointer-events-none">
        <button
          onClick={prevSlide}
          disabled={galleryImages.length === 0}
          className="pointer-events-auto w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:bg-black/60 border border-white/10 hover:border-white/20 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          disabled={galleryImages.length === 0}
          className="pointer-events-auto w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:bg-black/60 border border-white/10 hover:border-white/20 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === currentSlide ? "bg-primary w-6" : "bg-white/40 w-1.5 hover:bg-white/60"
            )}
          />
        ))}
      </div>
    </section>
  );
};
