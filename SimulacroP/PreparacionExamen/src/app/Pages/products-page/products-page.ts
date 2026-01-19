import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ProductCard } from '../../Components/product-card/product-card';
import { IProducto } from '../../Interfaces/iproducto';
import { ProductService } from '../../Services/product-service';
import { NavBar } from "../../Components/nav-bar/nav-bar";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products-page',
  imports: [ProductCard, NavBar],
  templateUrl: './products-page.html',
  styleUrl: './products-page.css',
})
export class ProductsPage {

  productoArray!: IProducto[];
  productoService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);


  ngOnInit(){
    this.cargarProductos();
    console.log("NGon INIt ejecutandose");
    
  }

  async cargarProductos(): Promise<void>{
    try{
      const response = await this.productoService.getAllUsers();
      this.productoArray = response.products;
      this.cdr.detectChanges();
    }
    catch(error){
      console.error('Error al obtener los usuarios:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los usuarios',
      });
    }
    
  }
  
  
}
