import { ICategory } from "./icategory";

export interface IProduct {
  id: number,
  title: string,
  price: number,
  description: string,
  categoryId: number,
  category: ICategory,
  images: string[],
  slug: string,
  creationAt: string,
  updatedAt: string
}
