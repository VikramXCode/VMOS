import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { CartProvider, useCart } from "@/contexts/CartContext";

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;

describe("CartContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("adds items, increments quantity, and updates totals", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        id: "p1",
        name: "PS5 Controller",
        price: 5999,
        image: "img",
        category: "Accessories",
      });
      result.current.addItem({
        id: "p1",
        name: "PS5 Controller",
        price: 5999,
        image: "img",
        category: "Accessories",
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(11998);
    expect(result.current.isInCart("p1")).toBe(true);
  });

  it("updates quantity, removes item on zero, and clears cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        id: "p2",
        name: "Gaming Mouse",
        price: 1999,
        image: "img",
        category: "Accessories",
      });
      result.current.updateQuantity("p2", 3);
    });

    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(5997);

    act(() => {
      result.current.updateQuantity("p2", 0);
    });

    expect(result.current.items).toHaveLength(0);

    act(() => {
      result.current.addItem({
        id: "p3",
        name: "Gaming Keyboard",
        price: 4499,
        image: "img",
        category: "Accessories",
      });
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });
});
