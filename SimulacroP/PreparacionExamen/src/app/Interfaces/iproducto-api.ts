import { IProducto } from "./iproducto";

export interface IProductoApi {
    products: IProducto[],
    total: number,
    skip: number,
    limit: number;
}
