import { createRouter } from "./context";
import { env } from "../../env/server.mjs";
import { z } from "zod";
import { Menu } from "./menu";
import { Location } from "./locations";

export const menuItemSchema = z.object({
    food_type: z.string(),
    item_name: z.string(),
    price: z.number(),
    true_cost: z.number(),
    image: z.string(),
    description: z.string(),
});

export const locationSchema = z.object({
    address: z.string(),
    lat: z.number(),
    lon: z.number(),
    phone: z.string(),
    constant_cost: z.number(),
})

export const adminRouter = createRouter()
    .mutation('createMenuItem', {
        input: menuItemSchema,
        async resolve({ input }) {
            const item = await fetch(env.SERVICE_URL + 'create_menu_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
            }).then(res => res.json() as unknown as Menu);
            return item;
        },
    })
    .mutation('updateMenuItem', {
        input: z.object({
            id: z.number(),
            data: menuItemSchema,
        }),
        async resolve({ input }) {
            const item = await fetch(env.SERVICE_URL + 'update_menu_item/' + input.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input.data),
            }).then(res => res.json() as unknown as Menu);
            return item;
        }
    })
    .mutation('deleteMenuItem', {
        input: z.object({
            id: z.number(),
        }),
        async resolve({ input }) {
            const item = await fetch(env.SERVICE_URL + 'delete_menu_item/' + input.id, {
                method: 'DELETE',
            }).then(res => res.json() as unknown as Menu);
            return item;
        }
    })
    .mutation('createLocation', {
        input: locationSchema,
        async resolve({ input }) {
            const item = await fetch(env.SERVICE_URL + 'create_store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
            }).then(res => res.json() as unknown as Location);
            return item;
        }
    })
    .mutation('deleteLocation', {
        input: z.object({
            id: z.number(),
        }),
        async resolve({ input }) {
            const item = await fetch(env.SERVICE_URL + 'delete_store/' + input.id, {
                method: 'DELETE',
            }).then(res => res.json() as unknown as Location);
            return item;
        }
    })
    .query('cashiers', {
        async resolve({ ctx }) {
            const cashiers = await ctx.prisma.user.findMany({
                where: {
                    type: 'CASHIER',
                },
            });
            return cashiers;
        }
    })
    .mutation('addCashier', {
        input: z.object({
            email: z.string().email(),
            name: z.string(),
            location: z.number(),
        }),
        async resolve({ ctx, input }) {
            const user = await ctx.prisma.user.create({
                data: {
                    email: input.email,
                    name: input.name,
                    type: 'CASHIER',
                    location: input.location,
                }
            });
            return user;
        }
    })
    .mutation('deleteCashier', {
        input: z.object({
            id: z.string(),
        }),
        async resolve({ ctx, input }) {
            await ctx.prisma.user.delete({
                where: {
                    id: input.id,
                }
            });
            return true;
        }
    })
