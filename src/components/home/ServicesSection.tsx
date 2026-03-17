import { Gamepad2, ShoppingCart, Trophy, Wrench, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Gamepad2,
    title: "Gaming Sessions",
    description: "PC, PS5, PS4, PS3, PS2 & Xbox",
    color: "from-cyan-500 to-blue-600",
    price: "Rates Vary",
    glow: "group-hover:shadow-cyan-500/20",
  },
  {
    icon: ShoppingCart,
    title: "Game Shop",
    description: "Games, consoles & accessories",
    color: "from-purple-500 to-pink-600",
    price: "Best Prices",
    glow: "group-hover:shadow-purple-500/20",
  },
  {
    icon: Trophy,
    title: "Tournaments",
    description: "Weekly competitions & prizes",
    color: "from-yellow-500 to-orange-600",
    price: "₹200 Entry",
    glow: "group-hover:shadow-yellow-500/20",
  },
  {
    icon: Wrench,
    title: "Repairs",
    description: "Console & controller service",
    color: "from-green-500 to-emerald-600",
    price: "Quick Fix",
    glow: "group-hover:shadow-green-500/20",
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-10 px-4">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="h-5 w-5 text-secondary" />
          <h2 className="text-xl font-heading font-bold">Our Services</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              className={cn(
                "group aspect-square lg:aspect-auto p-3 sm:p-5 rounded-2xl bg-gradient-to-br from-surface-2 to-surface-2/70 border border-border/50 hover:border-primary/30 transition-all duration-300 hover-lift cursor-default flex flex-col"
              )}
            >
              <div className="flex-1 flex flex-col">
                <div
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 sm:mb-4 shadow-lg transition-shadow duration-300",
                    service.color,
                    service.glow
                  )}
                >
                  <service.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-[13px] sm:text-sm leading-snug mb-1">{service.title}</h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
              <span className="mt-2 sm:mt-3 inline-flex w-full justify-center text-[11px] sm:text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-1 rounded-full whitespace-nowrap">
                {service.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
