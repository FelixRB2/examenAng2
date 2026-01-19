import { Icategoria } from "./icategoria"

export interface Iproduct {
  id: number,
  title: string,
  slug: string,
  price: number,
  description: string,
  category: Icategoria,
  images: string[],
  creationAt: string,
  updatedAt: string
}
