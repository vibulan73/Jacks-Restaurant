// Centralized configuration — all env-driven values in one place.
// Fallback values are development defaults only.

// ─── Restaurant Info ────────────────────────────────────────
export const RESTAURANT_NAME =
  import.meta.env.VITE_RESTAURANT_NAME || "Jack's Norwood";
export const RESTAURANT_PHONE = import.meta.env.VITE_RESTAURANT_PHONE || "";
export const RESTAURANT_EMAIL = import.meta.env.VITE_RESTAURANT_EMAIL || "";
export const RESTAURANT_ADDRESS = import.meta.env.VITE_RESTAURANT_ADDRESS || "";

// ─── Opening Hours ──────────────────────────────────────────
export const OPENING_HOURS = [
  {
    day: "Monday - Thursday",
    time: import.meta.env.VITE_HOURS_MON_THU || "11:00 AM - 10:00 PM",
  },
  {
    day: "Friday - Saturday",
    time: import.meta.env.VITE_HOURS_FRI_SAT || "11:00 AM - 12:00 AM",
  },
  {
    day: "Sunday",
    time: import.meta.env.VITE_HOURS_SUN || "12:00 PM - 9:00 PM",
  },
];

// ─── Fallback / Placeholder Images ─────────────────────────
export const FALLBACK_IMAGE = "/images/placeholder-food.svg";

// ─── Local Storage Keys ────────────────────────────────────
export const LS_TOKEN_KEY = "jn_token";
export const LS_USER_KEY = "jn_user";
