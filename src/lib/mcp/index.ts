import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchProducts from "./tools/search-products";
import getProduct from "./tools/get-product";
import listEvents from "./tools/list-events";
import listStores from "./tools/list-stores";
import myOrders from "./tools/my-orders";
import myAppointments from "./tools/my-appointments";
import bookAppointment from "./tools/book-appointment";

// The OAuth issuer must be the direct Supabase host; only the project ref
// survives publish unchanged, so build the issuer from the inlined literal.
const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "vin-eyewear",
  title: "Vin Eyewear",
  version: "0.1.0",
  instructions:
    "Tools for the Vin Eyewear store (kính mắt & đo khúc xạ). Use `search_products` and `get_product` to browse the catalog, `list_events` for promotions and news, `list_stores` for branch info, `my_orders` and `my_appointments` for the signed-in customer's own records, and `book_appointment` to schedule an eye exam.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    searchProducts,
    getProduct,
    listEvents,
    listStores,
    myOrders,
    myAppointments,
    bookAppointment,
  ] as unknown as Parameters<typeof defineMcp>[0]["tools"],
});
