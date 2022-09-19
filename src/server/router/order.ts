import { z } from "zod";
import { env } from "../../env/server.mjs";
import { createRouter } from "./context";

export interface Order {
  id: number;
  order_date: string;
  store_id: number;
  user_id: string;
  items: number[];
  total_cost: number;
  total_true_cost: number;
  status: string;
  used_discount: boolean;
}

export const orderRouter = createRouter()
  .query("get", {
    input: z.string(),
    async resolve({ ctx, input }) {
      const users = await ctx.prisma.user.findMany({
        where: {
          type: 'CUSTOMER',
        },
      });
      const orders = await fetch(env.SERVICE_URL + 'orders/' + input).then(res => res.json() as unknown as Order[]);
      return orders.map((order) => ({
        ...order,
        user: users.find((user) => user.id === order.user_id),
      }));
    },
  })
  .query('getMy', {
    async resolve({ ctx }) {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        return [];
      }
      const orders = await fetch(env.SERVICE_URL + 'orders/' + userId).then(res => res.json() as unknown as Order[]);
      return orders;
    }
  })
  .query('getAll', {
    async resolve({ ctx }) {
      const users = await ctx.prisma.user.findMany({
        where: {
          type: 'CUSTOMER',
        },
      });
      const orders = await fetch(env.SERVICE_URL + 'get_all_orders/').then(res => res.json() as unknown as Order[]);
      return orders.map((order) => ({
        ...order,
        user: users.find((user) => user.id === order.user_id),
      }));
    },
  })
  .mutation('create', {
    input: z.object({
      user_id: z.string(),
      items: z.record(z.number()),
      location_id: z.number(),
    }),
    async resolve({ input }) {
      const order = await fetch(env.SERVICE_URL + 'create_order/', {
        method: 'POST',
        body: JSON.stringify(input),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json() as unknown);
      return order;
    }
  })
  .mutation('userOrder', {
    input: z.object({
      items: z.record(z.number()),
      location_id: z.number(),
      total: z.number(),
    }),
    async resolve({ ctx, input }) {
      const id = ctx.session?.user?.id;
      if (!id) {
        return null;
      }
      await fetch(env.SERVICE_URL + 'create_order', {
        method: 'POST',
        body: JSON.stringify({
          user_id: id,
          ...input,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(async res => {
        const text = await res.text();
        return JSON.parse(text) as unknown as Order;
      });

      const { order: { checkout_url } } = await fetch('https://stage-api.ioka.kz/v2/orders', {
        method: 'POST',
        body: JSON.stringify({
          "amount": input.total * 100,
          "currency": "KZT",
          "description": "Покупка в Zebra Coffee",
          "success_url": `${env.MAIN_URL}profile`,
          "back_url": `${env.MAIN_URL}profile`,
        }),
        headers: {
          'Content-Type': 'application/json',
          'API-KEY': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NzAxMjMzNDAsImlhdCI6MTY0OTkxMzQwOCwiYXpwIjoiZGFzaGJvYXJkIiwiaXNzIjoiZ2FybWl1cyIsInN1YiI6InVzcl9hNDNhMmU3NC0zYWUzLTRmOGMtYTk2Ni03NjA2NTNkOGFjODQiLCJhdWQiOlsic3BsaXQiLCJpZGVudGl0eSIsInRva2VuaXplciIsImN1c3RvbWVyIiwicGF5b3V0cyIsIndhbGxldCIsImNvcmUiXSwicmVzb3VyY2VfYWNjZXNzIjp7InNwbGl0Ijp7InJvbGVzIjpbInNwbGl0czpyZWFkIiwic3BsaXRzOndyaXRlIiwic3BsaXRzOnJlbW92ZSIsInNwbGl0cy5ldmVudHM6cmVhZCIsInNwbGl0cy53ZWJob29rczp3cml0ZSIsInNwbGl0cy53ZWJob29rczpyZWFkIiwic3BsaXRzLndlYmhvb2tzOnJlbW92ZSJdfSwiaWRlbnRpdHkiOnsicm9sZXMiOlsiaWRlbnRpdGllcy5jbGFzc2VzOnJlYWQiLCJpZGVudGl0aWVzLmNsYXNzZXM6d3JpdGUiLCJpZGVudGl0aWVzLmNsYXNzZXM6cmVtb3ZlIiwiaWRlbnRpdGllczpyZWFkIiwiaWRlbnRpdGllczp3cml0ZSIsImlkZW50aXRpZXM6cmVtb3ZlIl19LCJ0b2tlbml6ZXIiOnsicm9sZXMiOlsicGF5bWVudC1tZXRob2RzOndyaXRlIl19LCJjdXN0b21lciI6eyJyb2xlcyI6WyJjdXN0b21lcnM6d3JpdGUiLCJjdXN0b21lcnM6cmVhZCIsImN1c3RvbWVycy4qLmNhcmRzOndyaXRlIiwiY3VzdG9tZXJzLiouY2FyZHM6cmVhZCJdfSwicGF5b3V0cyI6eyJyb2xlcyI6WyJwYXlvdXQtb3JkZXJzOndyaXRlIiwicGF5b3V0LW9yZGVyczpyZWFkIiwicmVjZWl2ZXJzOnJlYWQiLCJyZWNlaXZlcnM6d3JpdGUiLCJwYXlvdXQtd2ViaG9va3M6d3JpdGUiLCJwYXlvdXQtd2ViaG9va3M6cmVhZCJdfSwid2FsbGV0Ijp7InJvbGVzIjpbIndhbGxldHM6cmVhZCIsIndhbGxldHM6d3JpdGUiLCJ3YWxsZXRzOnJlbW92ZSIsIndhbGxldHMuYWNjb3VudDpyZWFkIiwid2FsbGV0cy5ldmVudHM6cmVhZCIsIndhbGxldHMudHJhbnNhY3Rpb25zOnJlYWQiLCJ3YWxsZXRzLnRyYW5zYWN0aW9uczp3cml0ZSIsIndhbGxldHMudHJhbnNhY3Rpb25zOnJlbW92ZSIsIndhbGxldHMudzJ3OndyaXRlIiwid2FsbGV0cy53Mnc6cmVhZCIsIndhbGxldHMud2ViaG9va3M6d3JpdGUiLCJ3YWxsZXRzLndlYmhvb2tzOnJlYWQiLCJ3YWxsZXRzLndlYmhvb2tzOnJlbW92ZSIsIndpdGhkcmF3YWxzOnJlYWQiLCJ3aXRoZHJhd2Fsczp3cml0ZSIsIndpdGhkcmF3YWxzOnJlbW92ZSJdfSwiY29yZSI6eyJyb2xlcyI6WyJvcmRlcnM6d3JpdGUiLCJvcmRlcnM6cmVhZCIsIm9yZGVycy4qLnBheW1lbnRzOndyaXRlIiwib3JkZXJzLioucGF5bWVudHM6cmVhZCIsIm9yZGVycy4qLnBheW1lbnRzLioucmVmdW5kczp3cml0ZSIsIm9yZGVycy4qLnBheW1lbnRzLioucmVmdW5kczpyZWFkIiwid2ViaG9va3M6d3JpdGUiLCJ3ZWJob29rczpyZWFkIiwic3Vic2NyaXB0aW9uczp3cml0ZSIsInN1YnNjcmlwdGlvbnM6cmVhZCIsInN1YnNjcmlwdGlvbnMuKi5vcmRlcnMuKi5wYXltZW50czp3cml0ZSIsInN1YnNjcmlwdGlvbnMuKi5vcmRlcnMuKi5wYXltZW50czpyZWFkIl19fSwidXNlciI6eyJpZCI6InVzcl9hNDNhMmU3NC0zYWUzLTRmOGMtYTk2Ni03NjA2NTNkOGFjODQiLCJkaXNwbGF5X25hbWUiOiJBaWt1bWlzIEthbGkiLCJ1c2VybmFtZSI6ImEua2FsaUBpb2thLmt6IiwiZmlyc3RfbmFtZSI6IkFpa3VtaXMiLCJsYXN0X25hbWUiOiJLYWxpIiwiZW1haWwiOiJhLmthbGlAaW9rYS5reiIsInN0YXR1cyI6IkFDVElWRSJ9LCJzaG9wIjp7ImlkIjoic2hwXzRYVUZVNEY3N0YiLCJvd25lcl9pZCI6InVzcl9hNDNhMmU3NC0zYWUzLTRmOGMtYTk2Ni03NjA2NTNkOGFjODQiLCJiaW4iOiI0NTM2MzIzNjM2MjMiLCJkaXNwbGF5X25hbWUiOiJiZXlvbmQgY3VycmljdWx1bSB0ZXN0Iiwic3RhdHVzIjoiQUNDRVBURUQifSwibG9jYWxlIjoicnUifQ.iWeeHuApuug3me71A58w0q_mHW92aQ2YvBPXLBwxDLsPGk-ybF0NCHrlaPT4au3W_12EaGfjgo2svpOwdM2KV77JA5R8tTI25BEBny_4xytOX5YaEYV5yl0W_fQJyHdaWSFlYDctoZA_pwir2wIg7m_saTK_P4VkuW25d6X8COBtFsQV6IczZYIqvJiH3CKek2WRaG7VlVAXT_Aqh7R_wnN2B9GcRyFvye24IAhKfDqXavj1H-1qzp3TEqUk9nxXsYvtDWNLhz3h-z7igvrQW9c21d2inUjFuIe03a0KDYlH8nHsTJe-P8LHOFLmDufNusgoGC4NjVwSpxsBnKvv8A',
        },
      }).then(async res => {
        const json = await res.json();
        console.log(json);
        return json as unknown as { order: { checkout_url: string } }
      });

      return checkout_url;
    }
  })
  .mutation('setReady', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input: { id } }) {
      await fetch(env.SERVICE_URL + 'update_order_status', {
        method: 'POST',
        body: JSON.stringify({
          order_id: id,
          status: 'ready',
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return { ok: true };
    }
  })
