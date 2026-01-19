import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  //LO EXPLICO EN README 
  // Obtiene el rol requerido desde la configuración de la ruta
  const expectedRole = route.data['role'];
  
  // Obtiene el rol del usuario desde localStorage
  const userRole = localStorage.getItem('user_role');

  // Si el usuario tiene el rol esperado, permite el acceso
  if (userRole === expectedRole) {
    return true;
  } else {
    // Si no tiene el rol, redirige a home
    alert('No tienes permisos para acceder a esta página');
    router.navigate(['/home']);
    return false;
  }
};

//////////////////////////////////
import { roleGuard } from './guards/role.guard'; // ← Importa

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login'},
    { path: 'login', component: Login, canActivate: [loginGuard] },
    
    {
        path: '',
        canActivate: [authguardGuard],
        children: [
            { path: 'home', component: Home},
            
            // ← RUTA PROTEGIDA POR ROL
            { 
                path: 'admin', 
                component: AdminComponent, // Crea este componente
                canActivate: [roleGuard],
                data: { role: 'admin' } // ← Define el rol requerido
            },
            
            { path: 'formulario', component: UserFormComponent},
            { path: 'formulario/:_id', component: UserFormComponent},
            { path: 'usuarios', component: UserList},
            { path: 'usuarios/:_id', component: UserView},
        ]
    },

    { path: '**', component: Page404 },
];



================================================================================
  GUÍA DE FILTROS ANGULAR PARA EXAMEN - SIN PIPES
  Métodos en Servicios y Componentes
================================================================================

ÍNDICE:
1. Filtrar por Categoría
2. Filtrar por Búsqueda de Texto
3. Filtrar por Rango de Precio
4. Filtrar por Activo/Inactivo
5. Ordenar Productos (Sort)
6. Filtros Combinados
7. Resetear Filtros
8. Contador de Resultados
9. Filtro con Debounce
10. Paginación de Resultados
11. Resumen y Checklist

================================================================================
1. FILTRAR POR CATEGORÍA (Ya lo tienes en tu código)
================================================================================

// ========== EN EL SERVICIO (product.service.ts) ==========
getByCategory(categoria: string): Iproduct[] {
  if (!categoria || categoria === '') {
    return this.arrayProducts; // Todos si está vacío
  }
  return this.arrayProducts.filter(p => p.category === categoria);
}

// ========== EN EL COMPONENTE (product-list.component.ts) ==========
getcategory(categoria: string) {
  this.productos = this.ProductService.getByCategory(categoria);
}

// ========== EN EL TEMPLATE ==========
<app-filter-form (categoriaSelect)="getcategory($event)"></app-filter-form>


================================================================================
2. FILTRAR POR BÚSQUEDA DE TEXTO
================================================================================
Buscar en nombre, descripción o categoría

// ========== EN EL SERVICIO ==========
searchProducts(searchText: string): Iproduct[] {
  if (!searchText || searchText.trim() === '') {
    return this.arrayProducts;
  }
  
  searchText = searchText.toLowerCase();
  
  return this.arrayProducts.filter(p => 
    p.name.toLowerCase().includes(searchText) ||
    p.description.toLowerCase().includes(searchText) ||
    p.category.toLowerCase().includes(searchText)
  );
}

// ========== EN EL COMPONENTE ==========
export class ProductListComponent {
  productos: Iproduct[] = [];
  searchText: string = '';

  ngOnInit() {
    this.productos = this.ProductService.getAllPro();
  }

  onSearch() {
    this.productos = this.ProductService.searchProducts(this.searchText);
  }
}

// ========== EN EL TEMPLATE ==========
<input 
  type="text" 
  [(ngModel)]="searchText" 
  (input)="onSearch()"
  placeholder="Buscar producto..."
  class="form-control">


================================================================================
3. FILTRAR POR RANGO DE PRECIO
================================================================================

// ========== EN EL SERVICIO ==========
getByPriceRange(minPrice: number, maxPrice: number): Iproduct[] {
  return this.arrayProducts.filter(p => 
    p.price! >= minPrice && p.price! <= maxPrice
  );
}

// ========== EN EL COMPONENTE ==========
export class ProductListComponent {
  productos: Iproduct[] = [];
  minPrice: number = 0;
  maxPrice: number = 1000;

  filterByPrice() {
    this.productos = this.ProductService.getByPriceRange(
      this.minPrice, 
      this.maxPrice
    );
  }
}

// ========== EN EL TEMPLATE ==========
<div class="d-flex gap-2">
  <input 
    type="number" 
    [(ngModel)]="minPrice" 
    (change)="filterByPrice()"
    placeholder="Precio mín">
  
  <input 
    type="number" 
    [(ngModel)]="maxPrice" 
    (change)="filterByPrice()"
    placeholder="Precio máx">
</div>


================================================================================
4. FILTRAR POR ACTIVO/INACTIVO
================================================================================

// ========== EN EL SERVICIO ==========
getByActive(isActive: boolean): Iproduct[] {
  return this.arrayProducts.filter(p => p.active === isActive);
}

// O para mostrar todos o solo activos
getProductsByActiveStatus(showAll: boolean): Iproduct[] {
  if (showAll) {
    return this.arrayProducts;
  }
  return this.arrayProducts.filter(p => p.active === true);
}

// ========== EN EL COMPONENTE ==========
export class ProductListComponent {
  productos: Iproduct[] = [];
  showInactive: boolean = false;

  filterByActiveStatus() {
    if (this.showInactive) {
      this.productos = this.ProductService.getAllPro();
    } else {
      this.productos = this.ProductService.getByActive(true);
    }
  }
}

// ========== EN EL TEMPLATE ==========
<label>
  <input 
    type="checkbox" 
    [(ngModel)]="showInactive"
    (change)="filterByActiveStatus()">
  Mostrar productos inactivos
</label>


================================================================================
5. ORDENAR PRODUCTOS (SORT)
================================================================================

// ========== EN EL SERVICIO ==========
sortProducts(products: Iproduct[], field: string, order: 'asc' | 'desc'): Iproduct[] {
  return [...products].sort((a, b) => {
    let valueA = a[field as keyof Iproduct];
    let valueB = b[field as keyof Iproduct];

    // Manejar strings y números
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) {
      return order === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

// ========== EN EL COMPONENTE ==========
export class ProductListComponent {
  productos: Iproduct[] = [];
  sortField: string = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  sortProducts() {
    this.productos = this.ProductService.sortProducts(
      this.productos,
      this.sortField,
      this.sortOrder
    );
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortProducts();
  }
}

// ========== EN EL TEMPLATE ==========
<select [(ngModel)]="sortField" (change)="sortProducts()">
  <option value="name">Nombre</option>
  <option value="price">Precio</option>
  <option value="category">Categoría</option>
</select>

<button (click)="toggleSortOrder()">
  {{ sortOrder === 'asc' ? '↑ Ascendente' : '↓ Descendente' }}
</button>


================================================================================
6. FILTROS COMBINADOS (MUY IMPORTANTE)
================================================================================
Aplicar múltiples filtros a la vez

// ========== EN EL SERVICIO ==========
filterProducts(filters: {
  category?: string;
  searchText?: string;
  minPrice?: number;
  maxPrice?: number;
  showInactive?: boolean;
}): Iproduct[] {
  let result = [...this.arrayProducts];

  // Filtrar por categoría
  if (filters.category && filters.category !== '') {
    result = result.filter(p => p.category === filters.category);
  }

  // Filtrar por búsqueda
  if (filters.searchText && filters.searchText.trim() !== '') {
    const search = filters.searchText.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
    );
  }

  // Filtrar por precio
  if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
    result = result.filter(p => 
      p.price! >= filters.minPrice! && p.price! <= filters.maxPrice!
    );
  }

  // Filtrar por activos
  if (!filters.showInactive) {
    result = result.filter(p => p.active === true);
  }

  return result;
}

// ========== EN EL COMPONENTE ==========
export class ProductListComponent {
  productos: Iproduct[] = [];
  
  // Filtros
  selectedCategory: string = '';
  searchText: string = '';
  minPrice: number = 0;
  maxPrice: number = 1000;
  showInactive: boolean = false;

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    this.productos = this.ProductService.filterProducts({
      category: this.selectedCategory,
      searchText: this.searchText,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      showInactive: this.showInactive
    });
  }
}

// ========== EN EL TEMPLATE ==========
<div class="container mb-3">
  <!-- Búsqueda -->
  <input 
    type="text" 
    [(ngModel)]="searchText" 
    (input)="applyFilters()"
    placeholder="Buscar..."
    class="form-control mb-2">

  <!-- Categoría -->
  <select [(ngModel)]="selectedCategory" (change)="applyFilters()" class="form-select mb-2">
    <option value="">Todas las categorías</option>
    <option value="hombre">Hombre</option>
    <option value="mujer">Mujer</option>
    <option value="niño">Niño</option>
  </select>

  <!-- Precio -->
  <div class="d-flex gap-2 mb-2">
    <input type="number" [(ngModel)]="minPrice" (change)="applyFilters()" placeholder="Min">
    <input type="number" [(ngModel)]="maxPrice" (change)="applyFilters()" placeholder="Max">
  </div>

  <!-- Inactivos -->
  <label>
    <input type="checkbox" [(ngModel)]="showInactive" (change)="applyFilters()">
    Mostrar inactivos
  </label>
</div>


================================================================================
7. RESETEAR FILTROS
================================================================================

// ========== EN EL COMPONENTE ==========
resetFilters() {
  this.selectedCategory = '';
  this.searchText = '';
  this.minPrice = 0;
  this.maxPrice = 1000;
  this.showInactive = false;
  this.productos = this.ProductService.getAllPro();
}

// ========== EN EL TEMPLATE ==========
<button (click)="resetFilters()" class="btn btn-secondary">
  Limpiar filtros
</button>


================================================================================
8. CONTADOR DE RESULTADOS
================================================================================

// ========== EN EL COMPONENTE ==========
export class ProductListComponent {
  productos: Iproduct[] = [];
  totalProducts: number = 0;

  ngOnInit() {
    this.totalProducts = this.ProductService.getAllPro().length;
    this.applyFilters();
  }

  applyFilters() {
    this.productos = this.ProductService.filterProducts({...});
  }

  get filteredCount(): number {
    return this.productos.length;
  }
}

// ========== EN EL TEMPLATE ==========
<p>Mostrando {{ filteredCount }} de {{ totalProducts }} productos</p>


================================================================================
9. FILTRO CON DEBOUNCE (Búsqueda optimizada)
================================================================================
Para no filtrar en cada tecla, esperar que el usuario termine

// ========== EN EL COMPONENTE ==========
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export class ProductListComponent implements OnDestroy {
  productos: Iproduct[] = [];
  searchText: string = '';
  private searchSubject = new Subject<string>();

  ngOnInit() {
    // Esperar 300ms después de que el usuario deje de escribir
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchValue => {
      this.productos = this.ProductService.searchProducts(searchValue);
    });

    this.productos = this.ProductService.getAllPro();
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}

// ========== EN EL TEMPLATE ==========
<input 
  type="text" 
  [ngModel]="searchText"
  (ngModelChange)="onSearchChange($event)"
  placeholder="Buscar...">


================================================================================
10. PAGINACIÓN DE RESULTADOS
================================================================================

// ========== EN EL SERVICIO ==========
getPaginatedProducts(page: number, itemsPerPage: number): Iproduct[] {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return this.arrayProducts.slice(startIndex, endIndex);
}

// ========== EN EL COMPONENTE ==========
export class ProductListComponent {
  productos: Iproduct[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 0;

  ngOnInit() {
    this.calculateTotalPages();
    this.loadPage(1);
  }

  calculateTotalPages() {
    const total = this.ProductService.getAllPro().length;
    this.totalPages = Math.ceil(total / this.itemsPerPage);
  }

  loadPage(page: number) {
    this.currentPage = page;
    this.productos = this.ProductService.getPaginatedProducts(
      page, 
      this.itemsPerPage
    );
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }
}

// ========== EN EL TEMPLATE ==========
<div class="d-flex justify-content-center gap-2 mt-4">
  <button 
    (click)="previousPage()" 
    [disabled]="currentPage === 1"
    class="btn btn-primary">
    Anterior
  </button>

  <span class="badge bg-secondary fs-5">
    Página {{ currentPage }} de {{ totalPages }}
  </span>

  <button 
    (click)="nextPage()" 
    [disabled]="currentPage === totalPages"
    class="btn btn-primary">
    Siguiente
  </button>
</div>


================================================================================
11. RESUMEN Y CHECKLIST PARA EL EXAMEN
================================================================================

FILTROS BÁSICOS (Los más preguntados):
---------------------------------------
✓ Por categoría      → filter(p => p.category === cat)
✓ Por búsqueda       → filter(p => p.name.includes(text))
✓ Por rango          → filter(p => p.price >= min && p.price <= max)
✓ Por boolean        → filter(p => p.active === true)


OPERACIONES COMUNES:
--------------------
✓ Sort    → .sort((a,b) => ...)
✓ Filter  → .filter(item => condición)
✓ Find    → .find(item => item.id === id)
✓ Map     → .map(item => item.propiedad)


EVENTOS IMPORTANTES:
--------------------
✓ (change)  → Para selects
✓ (input)   → Para inputs de texto
✓ (click)   → Para botones
✓ [(ngModel)] → Two-way binding


ERRORES COMUNES A EVITAR:
--------------------------
✗ Olvidar FormsModule en imports
✗ No validar if (!texto || texto === '')
✗ Mutar array original (usar [...array])
✗ No manejar undefined en precios/campos opcionales


PATRÓN TÍPICO DE EXAMEN:
------------------------

// SERVICIO
getByX(parametro: tipo): Iproduct[] {
  if (!parametro) return this.arrayProducts;
  return this.arrayProducts.filter(p => p.campo === parametro);
}

// COMPONENTE
miPropiedad: tipo = valorInicial;

filtrar() {
  this.productos = this.servicio.getByX(this.miPropiedad);
}

// TEMPLATE
<input [(ngModel)]="miPropiedad" (change)="filtrar()">


MÉTODOS DE ARRAY MÁS USADOS:
-----------------------------
filter()     → Devuelve nuevo array con elementos que cumplan condición
find()       → Devuelve primer elemento que cumpla condición
findIndex()  → Devuelve índice del primer elemento que cumpla condición
map()        → Transforma cada elemento del array
sort()       → Ordena el array (MUTA el original, usar [...array])
slice()      → Extrae porción del array
includes()   → Verifica si contiene un valor
push()       → Añade elemento al final
splice()     → Elimina/añade elementos


VALIDACIONES IMPORTANTES:
--------------------------
✓ Siempre validar strings vacíos: if (!texto || texto.trim() === '')
✓ Validar undefined en números: if (precio !== undefined)
✓ toLowerCase() para búsquedas case-insensitive
✓ Crear copias de arrays antes de ordenar: [...array]


EJEMPLO COMPLETO DE COMPONENTE CON FILTROS:
--------------------------------------------

import { Component, inject } from '@angular/core';
import { Iproduct } from '../../interfaces/iproduct.interface';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  imports: [FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  productos: Iproduct[] = [];
  ProductService = inject(ProductService);
  
  // Propiedades para filtros
  selectedCategory: string = '';
  searchText: string = '';
  minPrice: number = 0;
  maxPrice: number = 1000;
  showInactive: boolean = false;

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters() {
    this.productos = this.ProductService.filterProducts({
      category: this.selectedCategory,
      searchText: this.searchText,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      showInactive: this.showInactive
    });
  }

  resetFilters() {
    this.selectedCategory = '';
    this.searchText = '';
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.showInactive = false;
    this.productos = this.ProductService.getAllPro();
  }
}


================================================================================
¡BUENA SUERTE EN EL EXAMEN! 🍀
================================================================================

CONSEJOS FINALES:
-----------------
1. Lee bien el enunciado antes de empezar
2. Empieza por los filtros más simples (categoría, búsqueda)
3. No te olvides de importar FormsModule
4. Prueba cada filtro individualmente antes de combinarlos
5. Si algo no funciona, verifica: imports, ngModel, métodos del servicio
6. Usa console.log() para debugear
7. Revisa la sintaxis de los eventos: (change), (input), (click)

RECUERDA:
---------
- El servicio contiene la LÓGICA de filtrado
- El componente llama al servicio y gestiona el estado
- El template tiene los inputs/selects con [(ngModel)] y eventos

¡TÚ PUEDES! 💪
