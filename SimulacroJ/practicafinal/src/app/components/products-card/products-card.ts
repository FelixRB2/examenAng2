import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ProductsServices } from '../../services/products-services';
import { IProducts } from '../../interfaces/iproducts';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products-card',
  imports: [RouterLink],
  templateUrl: './products-card.html',
  styleUrl: './products-card.css',
})
export class ProductsCard {

  prodcutsServices = inject(ProductsServices);
  @Input() product!: IProducts;
  @Output() productDeleted = new EventEmitter<string>();

  async deleteProduct(product: IProducts){
  const response = await Swal.fire({
        title: 'Are you sure?',
        text: `You are going to delete product ${product.name}. This action cannot be undo.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete',
        cancelButtonText: 'Cancel'
      });
      if(response.isConfirmed){
        try{
          await this.prodcutsServices.deleteProductById(product._id);
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: `Product ${product.name} deleted.`,
          });
          this.productDeleted.emit(product._id);
        } catch (error) {
          console.error('Error deleting employee:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `An error has ocurred while deleting product: ${product.name}. Try again later.`,
          });
        }
      }
    }
}
