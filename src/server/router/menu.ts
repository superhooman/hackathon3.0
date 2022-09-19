import { env } from "../../env/server.mjs";
import { createRouter } from "./context";

const DUMP_MENU = [
  {
    id: 0,
    food_type: 'Кофе',
    item_name: 'Лавандовый раф 360 мл',
    price: 950,
    image: 'https://cachizer1.2gis.com/market/5e3a84f2-57fb-4b8b-abf0-93cfd0841c63.png?w=1088',
    description: 'Лавандовый раф - это нежный кофейный напиток с мягким сливочным вкусом с добавлением фруктово-ягодного экстракта (эссенции), который не содержит в себе сахара, а является природным подсластителем со вкусом лаванды. Лавандовые нотки придают ему особый неповторимый вкус! Также в нашем ассортименте есть большой выбор растительного молока, который мы можем заменить по вашему пожеланию.',
    true_cost: 800,
  },
  {
    id: 1,
    food_type: 'Чай',
    item_name: 'Latte green matcha 360 мл',
    price: 850,
    image: 'https://cachizer3.2gis.com/market/c3f91521-6697-4adf-bf65-61e209f335aa.png?w=1088',
    description: 'Latte green matcha - это традиционный сорт японского зеленого чая, который представляет собой порошок ярко-зеленого цвета, высоко ценится своими полезными веществами, микроэлементами, аминокислотами и витаминами, содержащиеся в чайных листьях. Такой напиток подается с вспененным молоком и украшают рисунками в технике латте-арт. Данный напиток по Вашему пожеланию можно приготовить на основе миндального, соевого, рисового, кокосового молока. Содержание кофеина в порошке матча достаточно высокое, советуем его пить в первой половине дня, чтобы зарядиться энергией.',
    true_cost: 700,
  },
  {
    id: 2,
    food_type: 'Кофе',
    item_name: 'Капучино 360 мл',
    price: 850,
    image: 'https://cachizer3.2gis.com/market/5e3a84f2-57fb-4b8b-abf0-93cfd0841c63.png?w=1088',
    description: 'Капучино - это классический итальянский кофейный напиток, который приготовляется из двойного эспрессо, вспененного молока и крема. В нашем ассортименте есть большой выбор растительного молока, который мы можем заменить по вашему пожеланию.',
    true_cost: 700,
  }
]

export interface Menu {
  id: number;
  food_type: string;
  item_name: string;
  price: number;
  image: string;
  description: string;
  true_cost: number;
}

export const menuRouter = createRouter()
  .query("get", {
    async resolve() {
      const menu = await fetch(env.SERVICE_URL + 'menu').then(res => res.json() as unknown as Menu[]);
      return menu;
    },
  });
