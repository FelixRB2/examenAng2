import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Iproduct } from '../../interfaces/iproduct';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {

  private sProduct = inject(ProductService);

  @Input() product!: Iproduct;
  @Output() deleted = new EventEmitter<number>();

  async deleteProduct() {
    try {
      // Espera a que se complete la eliminación
      await this.sProduct.deleteByID(this.product.id);
      
      // Solo emite si la eliminación “fue exitosa”
      this.deleted.emit(this.product.id);
      console.log(`Producto eliminado: ${this.product.id}`);
      
    } catch (error) {
      console.error('Error eliminando producto:', error);
      alert('No se pudo eliminar el producto.');
    }
  }
}
