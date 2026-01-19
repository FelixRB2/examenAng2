import { IProducts } from "./iproducts";

export interface IApiProducts {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  results: IProducts[];
}
