"use client";

import { Button } from "@/components/ui/button";
import { type CartItem, useCart } from "./cart-provider";

export function AddToCartButton({ item }: Readonly<{ item: CartItem }>) {
  const { addItem } = useCart();
  return (
    <Button variant="accent" onClick={() => addItem(item)}>
      Добавить в корзину
    </Button>
  );
}
