// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { menuRouter } from "./menu";
import { locationsRouter } from "./locations";
import { protectedExampleRouter } from "./protected-example-router";
import { adminRouter } from "./admin";
import { orderRouter } from "./order";
import { discountRouter } from "./discounts";
import { statsRouter } from "./stats";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('admin.', adminRouter)
  .merge("menu.", menuRouter)
  .merge("locations.", locationsRouter)
  .merge("auth.", protectedExampleRouter)
  .merge('order.', orderRouter)
  .merge('discount.', discountRouter)
  .merge('stats.', statsRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
