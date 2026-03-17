import { Layout } from "@/components/layout/Layout";
import { Images, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePublicContent } from "@/contexts/PublicContentContext";

const categoryLabels: Record<string, string> = {
  all: "All",
  arena: "Arena",
  setup: "Setups",
  tournament: "Tournaments",
};

export const GalleryPage = () => {
  const { content } = usePublicContent();
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryItems = content.gallery.map((item, index) => ({ id: index + 1, ...item }));
  const categories = ["all", ...Array.from(new Set(galleryItems.map((item) => item.category)))];

  const filteredItems = activeCategory === "all"
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : 0));
  }, [lightboxIndex, filteredItems.length]);

  const prevImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : 0
    );
  }, [lightboxIndex, filteredItems.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, nextImage, prevImage]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Images className="h-5 w-5 text-primary" />
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              <span className="text-gradient">Gallery</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">Peek inside VMOS Game Station</p>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all duration-200",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground neon-glow"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground hover:bg-surface-3 border border-border/50"
              )}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="break-inside-avoid group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 80}ms` }}
              onClick={() => openLightbox(index)}
            >
              <div className="relative rounded-2xl overflow-hidden bg-surface-2 border border-border/50 hover:border-primary/30 transition-all duration-300 hover-lift">
                <img
                  src={item.url}
                  alt={item.title}
                  className={cn(
                    "w-full object-cover transition-transform duration-500 group-hover:scale-105",
                    item.tall ? "h-72 md:h-80" : "h-48 md:h-56"
                  )}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="font-heading font-semibold text-white text-sm">{item.title}</p>
                  <p className="text-xs text-white/60 capitalize">{item.category}</p>
                </div>
                {/* Expand icon */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          {/* Close button */}
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors z-10">
            <X className="h-5 w-5 text-white" />
          </button>

          {/* Navigation */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>

          {/* Image */}
          <div className="max-w-4xl max-h-[85vh] px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={filteredItems[lightboxIndex].url}
              alt={filteredItems[lightboxIndex].title}
              className="max-w-full max-h-[85vh] object-contain rounded-xl animate-fade-in-up"
            />
            <div className="text-center mt-4">
              <p className="font-heading font-semibold text-white">{filteredItems[lightboxIndex].title}</p>
              <p className="text-xs text-white/50 capitalize">{filteredItems[lightboxIndex].category}</p>
              <p className="text-xs text-white/30 mt-1 font-mono">
                {lightboxIndex + 1} / {filteredItems.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
