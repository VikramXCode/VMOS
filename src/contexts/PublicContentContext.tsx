import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

export interface ServiceContent {
  icon: string;
  title: string;
  description: string;
  price: string;
  color: string;
  glow: string;
}

export interface GalleryContentItem {
  url: string;
  category: string;
  title: string;
  tall?: boolean;
}

export interface PublicContent {
  heroImages: string[];
  services: ServiceContent[];
  location?: {
    mapEmbedUrl?: string;
    address?: string;
    directionsUrl?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
    hours?: string;
    instagram?: string;
    facebook?: string;
  };
  gallery: GalleryContentItem[];
}

interface PublicContentContextValue {
  content: PublicContent;
  isLoading: boolean;
  reload: () => Promise<void>;
}

const EMPTY_CONTENT: PublicContent = {
  heroImages: [],
  services: [],
  location: {},
  contact: {},
  gallery: [],
};

const PublicContentContext = createContext<PublicContentContextValue | undefined>(undefined);

export const PublicContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<PublicContent>(EMPTY_CONTENT);
  const [isLoading, setIsLoading] = useState(true);

  const reload = async () => {
    setIsLoading(true);
    try {
      const data = await api.content.get();
      setContent({
        heroImages: Array.isArray(data?.heroImages) ? data.heroImages : [],
        services: Array.isArray(data?.services) ? data.services : [],
        location: data?.location || {},
        contact: data?.contact || {},
        gallery: Array.isArray(data?.gallery) ? data.gallery : [],
      });
    } catch {
      setContent(EMPTY_CONTENT);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const value = useMemo(() => ({ content, isLoading, reload }), [content, isLoading]);
  return <PublicContentContext.Provider value={value}>{children}</PublicContentContext.Provider>;
};

export const usePublicContent = () => {
  const ctx = useContext(PublicContentContext);
  if (!ctx) throw new Error("usePublicContent must be used within PublicContentProvider");
  return ctx;
};
