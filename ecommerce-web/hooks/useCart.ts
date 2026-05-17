import { useCartStore } from "@/store/cart.store";

export function useCart() {
  const { items, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount } =
    useCartStore();

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total: getTotal(),
    itemCount: getItemCount(),
    isEmpty: items.length === 0,
  };
}
