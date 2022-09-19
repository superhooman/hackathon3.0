import { env } from "../../env/server.mjs";
import { createRouter } from "./context";

export interface Stats {
    items_frequences: { [key: string]: number };
    user_visits:      UserVisit[];
    user_spendings:   UserSpending[];
    mrginality:       Mrginality[];
}

export interface Mrginality {
    store_id:        number;
    date:            Date;
    total_cost:      number;
    total_true_cost: number;
    address:         string;
    id:              number;
    lon:             number;
    phone:           string;
    lat:             number;
    constant_cost:   number;
    earnings:        number;
}

export interface UserSpending {
    user_id:         string;
    total_cost:      number;
    total_true_cost: number;
}

export interface UserVisit {
    user_id: string;
    date:    Date;
    visits:  number;
}

export const statsRouter = createRouter()
  .query("get", {
    async resolve({ ctx }) {
        const stats = await fetch(env.SERVICE_URL + 'stats').then(res => res.json() as unknown as Stats);
        return stats;
    },
  })