import { z } from "zod";
import { env } from "../../env/server.mjs";
import { createRouter } from "./context";

interface Discount {
  user_id: string;
  amount: number;
}

export const discountRouter = createRouter()
  .query('getUsers', {
    async resolve({ ctx }) {
      const users = await ctx.prisma.user.findMany({
        where: {
          type: 'CUSTOMER',
        },
      });
      return users;
    }
  })
  .query('getDiscounts', {
    input: z.string(),
    async resolve({ ctx, input }) {
      const discount = await fetch(env.SERVICE_URL + 'get_discount/' + input).then(res => res.json() as unknown as Discount);
      return discount;
    }
  })
  .mutation('addDiscount', {
    input: z.object({
      user_id: z.string(),
      amount: z.number(),
    }),
    async resolve({ ctx, input }) {
      const discount = await fetch(env.SERVICE_URL + 'add_discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      }).then(res => res.json() as unknown as Discount);
      return discount;
    }
  })
