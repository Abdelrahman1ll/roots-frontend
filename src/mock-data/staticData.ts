import products from "./products.json";
import categories from "./categories.json";
import colors from "./colors.json";
import reviews from "./reviews.json";
import discountCodes from "./discount-codes.json";
import carts from "./carts.json";
import wishlist from "./wishlist.json";
import orders from "./orders.json";
import users from "./users.json";
import dashboard from "./dashboard.json";
import misc from "./misc.json";

export const staticData: Record<string, any> = {
  "/products": { products },
  "/categories": { categories },
  "/category": { categories }, // Alias
  "/colors": { colors },
  "/color": { colors }, // Alias
  "/reviews": reviews,
  "/discount-codes": { discountCodes },
  "/carts": carts,
  "/cart": carts, // Alias
  "/carts/owner": carts,
  "/wishlist": wishlist,
  "/wishlist/user": wishlist,
  "/wishlist/owner": wishlist,
  "/orders": { orders },
  "/orders/user": { orders },
  "/orders/admin": { orders },
  "/orders/owner": { orders },
  "/orders/dashboard": dashboard,
  "/users": users,
  "/delivery": misc.delivery,
  "/delivery/free-delivery": misc.freeDelivery,
  "/payment/init-payment": misc.payment,
  "/email-order-dispatcher": { dispatchers: misc.emailOrderDispatcher },
  "/email/report-crash": misc.successResponse,
  "/email": misc.successResponse,
};

/**
 * Returns a mock owner user for the static preview mode.
 */
export const getMockUser = () => ({
  id: 1,
  firstName: "Abdelrahman",
  lastName: "Mohamed",
  email: "abdelrahman.a.job.1@gmail.com",
  role: "owner",
  phone: "01065217980",
  birthday: "1999-01-01",
  createdAt: "2024-01-01T00:00:00Z",
  PROFILE: true,
});
