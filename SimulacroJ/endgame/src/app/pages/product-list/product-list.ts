import { Component, inject } from '@angular/core';
import { IProduct } from '../../interfaces/iproduct';
import { ProductServices } from '../../services/product-services';
import { ProductCard } from "../../components/product-card/product-card";

@Component({
  selector: 'app-product-list',
  imports: [ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {

  productsArray: IProduct[];
  productServices = inject(ProductServices);

  constructor() {
    this.productsArray = [];
  }

  currentPage: number = 1;
  totalProducts: number = 50;
  limit: number = 12;

  async ngOnInit(): Promise<void> {
    await this.loadProducts(this.currentPage);
  }

  async loadProducts(page: number): Promise<void> {
    const products = await this.productServices.getAllProducts(page, this.limit);
    this.productsArray = products;
    this.currentPage = page;
    console.log(this.productsArray);
  }

  async goOneBack(): Promise<void> {
    if (this.currentPage > 1) {
      await this.loadProducts(this.currentPage - 1);
    }
  }

  async goOneForward(): Promise<void> {
    if(this.currentPage < 5){
      await this.loadProducts(this.currentPage + 1);
    }
  }

  async onProductDeleted(deletedProductId: number): Promise<void> {
    this.productsArray = this.productsArray.filter(product => product.id !== deletedProductId);
  }
}
