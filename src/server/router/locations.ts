import { createRouter } from "./context";
import { env } from "../../env/server.mjs";

const DUMP_MENU = [
  { "id": 1, "address": "address_0", "lat": 0.15779112653634608, "lon": 0.3958174619181438, "phone": "0", "constant_cost": 23 },
  { "id": 2, "address": "address_1", "lat": 0.3690415597565794, "lon": 0.16152908490663076, "phone": "1", "constant_cost": 62 },
  { "id": 3, "address": "address_2", "lat": 0.8178859785111953, "lon": 0.5743851704388787, "phone": "2", "constant_cost": 31 },
  { "id": 4, "address": "address_3", "lat": 0.6209364299169512, "lon": 0.700033335177741, "phone": "3", "constant_cost": 50 },
  { "id": 5, "address": "address_4", "lat": 0.5108156769068698, "lon": 0.3073706614928249, "phone": "4", "constant_cost": 70 },
  { "id": 6, "address": "address_0", "lat": 0.5482971964261344, "lon": 0.924131746384354, "phone": "0", "constant_cost": 93 },
  { "id": 7, "address": "address_1", "lat": 0.7997829054032269, "lon": 0.8198778546603167, "phone": "1", "constant_cost": 56 },
  { "id": 8, "address": "address_2", "lat": 0.2593882694306968, "lon": 0.25021002481623156, "phone": "2", "constant_cost": 27 },
  { "id": 9, "address": "address_3", "lat": 0.03251023295728228, "lon": 0.20397591239902924, "phone": "3", "constant_cost": 96 },
  { "id": 10, "address": "address_4", "lat": 0.44321554363394433, "lon": 0.19675391495071215, "phone": "4", "constant_cost": 77 }
];

export interface Location {
  id: number;
  address: string;
  lat: number;
  lon: number;
  phone: string;
  constant_cost: number;
}

export const locationsRouter = createRouter()
  .query("get", {
    async resolve() {
      const locations = await fetch(env.SERVICE_URL + 'locations').then(res => res.json() as unknown as Location[]);
      return locations;
    },
  });
