import { Phone, Mail, Clock, ChevronRight, Instagram, Facebook, MessageCircle } from "lucide-react";
import { usePublicContent } from "@/contexts/PublicContentContext";

export const ContactSection = () => {
  const { content } = usePublicContent();
  const phone = content.contact?.phone || "";
  const email = content.contact?.email || "";
  const whatsapp = content.contact?.whatsapp || "";
  const hoursLabel = content.contact?.hours || "Daily: 10 AM - 11 PM";
  const instagram = content.contact?.instagram || "";
  const facebook = content.contact?.facebook || "";

  const openWhatsApp = () => {
    if (!whatsapp) return;
    const digits = whatsapp.replace(/[^\d]/g, "");
    window.open(`https://wa.me/${digits}?text=Hi! I have a question about VMOS Game Station.`, "_blank");
  };

  // Check if currently open (10 AM - 11 PM IST)
  const now = new Date();
  const hour = now.getHours();
  const isOpen = hour >= 10 && hour < 23;

  return (
    <section id="contact" className="py-10 px-4 bg-surface-2/30">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-heading font-bold">Contact Us</h2>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-heading font-semibold px-3 py-1 rounded-full ${
              isOpen
                ? "bg-accent/15 text-accent border border-accent/30"
                : "bg-destructive/15 text-destructive border border-destructive/30"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-accent animate-pulse" : "bg-destructive"}`} />
            {isOpen ? "Open Now" : "Closed"}
          </span>
        </div>

        <div className="space-y-3">
          {/* Phone */}
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-4 p-4 rounded-2xl bg-surface-2 border border-border/50 hover:border-primary/30 active:bg-surface-3 transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-heading uppercase tracking-wider">Phone</p>
              <p className="font-mono font-medium">{phone || "Not available"}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
          </a>

          {/* WhatsApp */}
          <button
            onClick={openWhatsApp}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface-2 border border-border/50 hover:border-[#25D366]/30 active:bg-surface-3 transition-all text-left"
          >
            <div className="w-11 h-11 rounded-xl bg-[#25D366] flex items-center justify-center shadow-lg">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-heading uppercase tracking-wider">WhatsApp</p>
              <p className="font-medium">Message Us</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
          </button>

          {/* Email */}
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-4 p-4 rounded-2xl bg-surface-2 border border-border/50 hover:border-primary/30 active:bg-surface-3 transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-heading uppercase tracking-wider">Email</p>
              <p className="font-medium text-sm">{email || "Not available"}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
          </a>

          {/* Hours */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-2 border border-border/50">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center shadow-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-heading uppercase tracking-wider">Working Hours</p>
              <p className="font-heading font-bold">{hoursLabel}</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-6 p-5 rounded-2xl bg-surface-2 border border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-heading mb-3">Follow Us</p>
          <div className="flex gap-3">
            <a
              href={instagram || "#"}
              onClick={(e) => { if (!instagram) e.preventDefault(); }}
              className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 active:opacity-80 transition-opacity font-heading font-semibold text-sm"
            >
              <Instagram className="h-5 w-5 text-white" />
              <span>Instagram</span>
            </a>
            <a
              href={facebook || "#"}
              onClick={(e) => { if (!facebook) e.preventDefault(); }}
              className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 active:opacity-80 transition-opacity font-heading font-semibold text-sm"
            >
              <Facebook className="h-5 w-5 text-white" />
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
