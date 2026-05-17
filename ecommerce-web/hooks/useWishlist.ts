import { useWishlistStore } from "@/store/wishlist.store";

export function useWishlist() {
  const { items, toggleItem, isInWishlist, clearWishlist } = useWishlistStore();

  return {
    items,
    toggleItem,
    isInWishlist,
    clearWishlist,
    count: items.length,
    isEmpty: items.length === 0,
  };
}
