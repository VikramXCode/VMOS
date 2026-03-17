import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePublicContent } from "@/contexts/PublicContentContext";

export const LocationSection = () => {
  const [mapKey, setMapKey] = useState(0);
  const { content } = usePublicContent();
  const mapEmbedUrl = content.location?.mapEmbedUrl || "";
  const address = content.location?.address || "Address unavailable";
  const directionsUrl = content.location?.directionsUrl || "https://www.google.com/maps";

  return (
    <section id="location" className="py-10 px-4">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-heading font-bold">Our Location</h2>
        </div>

        <div className="rounded-2xl overflow-hidden bg-surface-2 border border-border/50">
          {/* Map */}
          <div className="aspect-[4/3] md:aspect-video relative" style={{ touchAction: 'auto' }}>
            <iframe
              key={mapKey}
              src={mapEmbedUrl}
              className="absolute inset-0 w-full h-full"
              style={{ border: 0, pointerEvents: 'auto', touchAction: 'auto' }}
              allow="geolocation"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="VMOS Game Station Location"
            />
          </div>

          {/* Address Card */}
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-0.5 font-heading uppercase tracking-wider">Address</p>
                <p className="text-sm font-medium leading-relaxed">
                  {address}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => window.open(directionsUrl, "_blank")}
                className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground font-heading font-semibold rounded-xl py-5"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Directions
              </Button>
              <Button
                onClick={() => setMapKey(prev => prev + 1)}
                variant="outline"
                className="border-border text-foreground font-heading font-semibold rounded-xl py-5 hover:bg-surface-3"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Recenter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
