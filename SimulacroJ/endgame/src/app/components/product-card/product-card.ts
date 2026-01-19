import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ProductServices } from '../../services/product-services';
import { IProduct } from '../../interfaces/iproduct';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {

  private productServices = inject(ProductServices);
  @Input() product!: IProduct;
  @Output() productDeleted = new EventEmitter<string>();

  async deleteProduct(productId: number): Promise<void> {
    try{
      await this.productServices.deleteProductById(productId);
      this.productDeleted.emit(productId.toString());
      console.log(`Product with ID ${productId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
}
