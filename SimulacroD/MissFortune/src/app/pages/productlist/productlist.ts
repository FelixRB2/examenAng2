import { Component, inject } from '@angular/core';
import { Iproduct } from '../../interfaces/iproduct';
import { ProductService } from '../../services/product-service';
import { ProductCard } from "../../components/product-card/product-card";

@Component({
  selector: 'app-productlist',
  imports: [ProductCard],
  templateUrl: './productlist.html',
  styleUrl: './productlist.css',
})
export class Productlist {

  productArray: Iproduct[] = [];
  productService = inject(ProductService);

  constructor() {
    this.productArray = []
  }
onProductDeleted(productId: number) {
  // Aquí puedes eliminarlo de tu array local para actualizar la vista
  this.productArray = this.productArray.filter(p => p.id !== productId);
  console.log('Producto eliminado con ID:', productId);
}


  async ngOnInit(): Promise<void>{
    this.productArray = await this.productService.getAll();
  }
}
