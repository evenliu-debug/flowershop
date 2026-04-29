"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Line snapshot so cart page does not need extra round-trips */
export type CartLine = {
  variantId: string;
  productId: string;
  quantity: number;
  slug: string;
  sku: string;
  priceUsd: number;
  titleEn: string;
  titleZh: string;
  sizeLabel?: string | null;
  colorLabel?: string | null;
};

type CartState = {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  setQty: (variantId: string, quantity: number) => void;
  removeLine: (variantId: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addLine: (line) => {
        const quantity = line.quantity ?? 1;
        const lines = get().lines;
        const i = lines.findIndex((l) => l.variantId === line.variantId);
        if (i >= 0) {
          const next = [...lines];
          next[i] = {
            ...next[i],
            quantity: next[i].quantity + quantity,
          };
          set({ lines: next });
        } else {
          const { quantity: lineQty, ...rest } = line;
          set({
            lines: [...lines, { ...rest, quantity: lineQty ?? quantity }],
          });
        }
      },
      setQty: (variantId, quantity) => {
        if (quantity < 1) {
          get().removeLine(variantId);
          return;
        }
        set({
          lines: get().lines.map((l) =>
            l.variantId === variantId ? { ...l, quantity } : l
          ),
        });
      },
      removeLine: (variantId) =>
        set({ lines: get().lines.filter((l) => l.variantId !== variantId) }),
      clear: () => set({ lines: [] }),
    }),
    { name: "even-shop-cart-v2" }
  )
);
