import fs from "fs";
import { resolve } from "path";

export enum DBField {
  PRODUCTS = "products",
  CART = "cart",
}

const filenames = {
  [DBField.PRODUCTS]: resolve(__dirname, "db/products.json"),
  [DBField.CART]: resolve(__dirname, "db/cart.json"),
};

export const readDB = (target: DBField) => {
  try {
    const result = JSON.parse(fs.readFileSync(filenames[target], "utf-8")); // TODO: utf-8은 기본값인데 꼭 지정해줘야 하는지 확인하기. 현재 타입스크립트에서는 지정해줘야함ㅁ..
    return result;
  } catch (err) {
    console.error(err);
  }
};

export const writeDB = (target: DBField, data: any) => {
  try {
    fs.writeFileSync(filenames[target], JSON.stringify(data, null, "  "));
  } catch (err) {
    console.error(err);
  }
};
