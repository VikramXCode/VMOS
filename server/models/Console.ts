import mongoose from "mongoose";

const consoleSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    icon: { type: String, default: "🎮" },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ConsoleModel = mongoose.model("Console", consoleSchema);
