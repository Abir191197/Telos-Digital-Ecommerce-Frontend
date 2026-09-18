// 🏷️ RTK Query Cache Tag Types 🏷️
// All tag types must be registered here centrally.
// Feature endpoint files reference these for providesTags / invalidatesTags.

export const TAG_TYPES = [
  "Auth",
  "User",
  "Client",
  "Booking",
  "Payment",
  "Tracking",
  "Report",
  "Notification",
  "Dashboard",
  "Category",
  "Brand",
  "Address",
  "Product",
  "Cart",
  "Wishlist",
  "Review",
  "Customer",
] as const;

export type TagType = (typeof TAG_TYPES)[number];
