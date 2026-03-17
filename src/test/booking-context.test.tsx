import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BookingProvider, useBooking } from "@/contexts/BookingContext";

const { mockApi } = vi.hoisted(() => ({
  mockApi: {
    consoles: {
      list: vi.fn(),
    },
    bookings: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/api", () => ({
  api: mockApi,
}));

const wrapper = ({ children }: { children: ReactNode }) => <BookingProvider>{children}</BookingProvider>;

describe("BookingContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("vmos-admin-token", "token");

    mockApi.consoles.list.mockReset();
    mockApi.bookings.list.mockReset();
    mockApi.bookings.create.mockReset();
    mockApi.bookings.update.mockReset();
    mockApi.bookings.delete.mockReset();

    mockApi.consoles.list.mockResolvedValue([
      { key: "ps5", name: "PlayStation 5", price: 100, icon: "🎮" },
    ]);
    mockApi.bookings.list.mockResolvedValue([]);
  });

  it("creates booking with mapped payload and updates availability", async () => {
    mockApi.bookings.create.mockResolvedValue({
      _id: "b1",
      customerName: "Arun",
      customerPhone: "9999999999",
      consoleId: "ps5",
      consoleName: "PlayStation 5",
      date: "2026-03-20",
      startTime: "10:00",
      endTime: "11:00",
      price: 100,
      status: "pending",
      createdAt: "2026-03-10T10:00:00.000Z",
    });

    const { result } = renderHook(() => useBooking(), { wrapper });

    await waitFor(() => {
      expect(result.current.consoles).toHaveLength(1);
    });

    let createdId = "";
    await act(async () => {
      const created = await result.current.addBooking({
        name: "Arun",
        phone: "9999999999",
        consoleId: "ps5",
        date: "2026-03-20",
        slots: [
          {
            id: "slot-10",
            start: "10:00",
            end: "11:00",
            hour: 10,
            available: true,
          },
        ],
      });
      createdId = created.id;
    });

    expect(createdId).toBe("b1");
    expect(mockApi.bookings.create).toHaveBeenCalledWith({
      customerName: "Arun",
      customerPhone: "9999999999",
      consoleId: "ps5",
      consoleName: "PlayStation 5",
      date: "2026-03-20",
      startTime: "10:00",
      endTime: "11:00",
      price: 100,
    });

    const slots = result.current.getAvailability("2026-03-20", "ps5");
    const bookedSlot = slots.find((slot) => slot.id === "slot-10");
    expect(bookedSlot?.available).toBe(false);
  });
});
