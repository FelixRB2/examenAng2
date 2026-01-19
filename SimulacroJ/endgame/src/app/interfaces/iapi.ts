import { IProduct } from "./iproduct";

export interface IApi {
  products: IProduct[];
  total: number;
  offset: number;
  limit: number;
}
