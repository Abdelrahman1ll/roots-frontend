import { toast } from "react-toastify";
import {
  fetchBaseQuery,
  type FetchArgs,
  type FetchBaseQueryError,
  type BaseQueryApi,
} from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import URL from "../../api/baseUrl";
import { staticData } from "../../mock-data/staticData";

const baseQuery = fetchBaseQuery({
  baseUrl: URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const rawUser = Cookies.get("user");
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser);
        if (user.accessToken) {
          headers.set("Authorization", `Bearer ${user.accessToken}`);
        }
      } catch {
        // Silently fail or log error
      }
    }

    return headers;
  },
});

export const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object,
) => {
  // --- Static Mock Injection (for GitHub Pages / No Backend) ---
  const url = typeof args === "string" ? args : args.url;

  // Intercept requests and return static data if we are in production or no API is set
  if (
    import.meta.env.PROD ||
    !import.meta.env.VITE_APP_API_URL ||
    import.meta.env.VITE_APP_API_URL.includes("localhost:3000")
  ) {
    // 1. Block Data Modification (POST, PUT, PATCH, DELETE)
    /* 
       English: We allow all GET requests to fetch mock data, but we block any requests that 
       try to add, edit, or delete data (POST, PUT, PATCH, DELETE) since there is no real server.
       Arabic: نسمح بجميع طلبات جلب البيانات (GET)، ولكن نمنع أي طلبات تحاول إضافة، تعديل، 
       أو حذف البيانات لعدم وجود سيرفر حقيقي، ونرجع رسالة توضح ذلك للمستخدم.
    */
    const method = typeof args === "string" ? "GET" : args.method || "GET";
    if (method.toUpperCase() !== "GET") {
      return {
        error: {
          status: 400,
          data: {
            message:
              "Backend server is currently offline. You are viewing the static preview version.",
          },
        },
      };
    }

    // 2. Exact Match or Query Params (e.g. /products?sortPrice=1)
    const [path, queryString] = url.split("?");

    if (staticData[path]) {
      let resultData = staticData[path];

      if (path === "/products" && queryString) {
        const params = new URLSearchParams(queryString);
        const dataNode = staticData["/products"];
        let productList = Array.isArray(dataNode)
          ? dataNode
          : dataNode.products || [];
        productList = [...productList]; // Clone array to sort safely

        const sortPrice = params.get("sortPrice");
        if (sortPrice === "1") {
          productList.sort((a: any, b: any) => a.price - b.price);
        } else if (sortPrice === "-1") {
          productList.sort((a: any, b: any) => b.price - a.price);
        }

        const bestSelling = params.get("bestSelling");
        if (bestSelling === "true") {
          productList.sort((a: any, b: any) => (b.sold || 0) - (a.sold || 0));
        }

        const minPrice = params.get("minPrice");
        if (minPrice) {
          productList = productList.filter(
            (p: any) => p.price >= Number(minPrice),
          );
        }

        const maxPrice = params.get("maxPrice");
        if (maxPrice) {
          productList = productList.filter(
            (p: any) => p.price <= Number(maxPrice),
          );
        }

        return { data: { products: productList } };
      }

      return { data: resultData };
    }

    // 3. ID Match (e.g. /products/1 or /reviews/1)
    for (const key in staticData) {
      if (path.startsWith(key + "/")) {
        const id = path.split("/").pop();
        const dataNode = staticData[key];
        const dataArray = Array.isArray(dataNode)
          ? dataNode
          : dataNode[key.replace("/", "")];

        if (Array.isArray(dataArray)) {
          // Special case for reviews: the ID in the URL is the product ID, and we need all reviews for it
          if (key === "/reviews") {
            const productReviews = dataArray.filter(
              (i: any) => String(i.productId) === String(id),
            );
            return { data: { review: productReviews } };
          }

          // Default case: find a single item by its own ID
          const item = dataArray.find((i: any) => String(i.id) === String(id));
          if (item) return { data: item };
        }
      }
    }
  }
  // -------------------------------------------------------------

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && (result.error as FetchBaseQueryError).status === 401) {
    const rawUser = Cookies.get("user");
    if (!rawUser) return result;

    try {
      const user = JSON.parse(rawUser);
      const refreshToken = user.refreshToken;

      if (!refreshToken) return result;

      const refreshResponse = (await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken: refreshToken },
        },
        api,
        extraOptions,
      )) as { data: { accessToken: string } };

      if (refreshResponse?.data?.accessToken) {
        const newAccessToken = refreshResponse.data.accessToken;

        // Update the user object in the cookie with the new access token
        const updatedUser = { ...user, accessToken: newAccessToken };

        Cookies.set("user", JSON.stringify(updatedUser), {
          expires: 90,
          secure: import.meta.env.VITE_NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
        });

        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      }
    } catch (error) {
      toast.error("Session expired. Please login again.");
      // Optional: Redirect to login or logout
    }
  }

  return result;
};
