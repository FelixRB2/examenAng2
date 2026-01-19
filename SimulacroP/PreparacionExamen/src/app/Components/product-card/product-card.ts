import { Component, Input } from '@angular/core';
import { IProducto } from '../../Interfaces/iproducto';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() miProducto!: IProducto;
}
