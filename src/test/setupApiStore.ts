import {
  configureStore,
  type Reducer,
  type Middleware,
} from "@reduxjs/toolkit";

export function setupApiStore(api: {
  reducerPath: string;
  reducer: Reducer;
  middleware: Middleware;
}) {
  const store = configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

  return store;
}
