import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "Gamepad2" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, default: "" },
    color: { type: String, default: "from-cyan-500 to-blue-600" },
    glow: { type: String, default: "group-hover:shadow-cyan-500/20" },
  },
  { _id: false }
);

const galleryItemSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    tall: { type: Boolean, default: false },
  },
  { _id: false }
);

const siteContentSchema = new mongoose.Schema(
  {
    heroImages: [{ type: String }],
    services: [serviceSchema],
    location: {
      mapEmbedUrl: { type: String, default: "" },
      address: { type: String, default: "" },
      directionsUrl: { type: String, default: "" },
    },
    contact: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      hours: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
    },
    gallery: [galleryItemSchema],
  },
  { timestamps: true }
);

export const SiteContent = mongoose.model("SiteContent", siteContentSchema);
