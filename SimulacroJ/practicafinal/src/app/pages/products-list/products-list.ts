import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ProductsCard } from "../../components/products-card/products-card";
import { IProducts } from '../../interfaces/iproducts';
import { ProductsServices } from '../../services/products-services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products-list',
  imports: [RouterLink, ProductsCard],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList {

  arrayProducts: IProducts[];
  productsServices = inject(ProductsServices);

  constructor(){
    this.arrayProducts = [];
  }

  pageActual: number = 1;
  totalPages: number = 1;
  totalProducts: number = 0;
  productsPerPage: number = 0;
  loading: boolean = false;

  async loadProducts(page:number):Promise<void>{
    this.loading = true;
    try{
      const response = await this.productsServices.getAllProducts(page);
      this.arrayProducts = response.results;
      this.pageActual = response.page;
      this.totalPages = response.total_pages;
      this.totalProducts = response.total;
      this.productsPerPage = response.per_page;
    } catch(error){
      console.error('Erorr loading products:', error);
    } finally{
      this.loading = false;
    }
  }
  async ngOnInit(): Promise<void>{
    await this.loadProducts(this.pageActual);
  }
  async onDeleteProduct(productId: string): Promise<void>{
      try{
        await this.productsServices.deleteProductById(productId);
        this.arrayProducts  = this.arrayProducts.filter(product => product._id !== productId);
        if(this.arrayProducts.length === 0 && this.pageActual >1){
          await this.loadProducts(this.pageActual -1);
        }
        if(this.arrayProducts.length === 0 && this.pageActual === 1){
          await this.loadProducts(this.pageActual);
        }
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Product successfully deleted.',
        });
      } catch(error){
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error deleting Product, try later.',
        });
        console.log('Error deleting Product: ', error)
      }
    }

    //Métodos de navegación de páginas
    goToPage(page: number): void { // Ir a una página específica
      if (page >= 1 && page <= this.totalPages) { // Verificamos que la página esté dentro de los límites
        this.loadProducts(page);
      }
    }

    goOneBack(): void{ // Ir una página atrás
      if(this.pageActual > 1){
        this.loadProducts(this.pageActual - 1);
      }
    }

    goOneForward(): void{ // Ir una página adelante
      if(this.pageActual < this.totalPages){
        this.loadProducts(this.pageActual + 1);
      }
    }
  }
