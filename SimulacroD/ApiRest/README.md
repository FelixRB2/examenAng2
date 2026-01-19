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
📚 CHEAT SHEET ANGULAR - EXAMEN
🔐 1. AUTENTICACIÓN Y GUARDS
AuthGuard (Proteger rutas privadas)
typescript// guards/authguard.guard.ts
export const authguardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  if(localStorage.getItem('access_token')) {
    return true; // Permite acceso
  } else {
    router.navigate(['/login']);
    return false; // Bloquea acceso
  }
};
Uso en rutas:
typescript{ path: 'home', component: Home, canActivate: [authguardGuard] }

LoginGuard (Evitar acceso a /login si ya está logueado)
typescript// guards/login.guard.ts
export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  if (localStorage.getItem('access_token')) {
    router.navigate(['/home']); // Redirige a home
    return false;
  }
  return true; // Permite acceso a login
};
Uso:
typescript{ path: 'login', component: Login, canActivate: [loginGuard] }

UnsavedChangesGuard (Avisar cambios sin guardar)
typescript// guards/unsaved-changes.guard.ts
export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  if (component.canDeactivate()) {
    return true;
  }
  return confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?');
};
En el componente:
typescriptexport class UserFormComponent implements CanComponentDeactivate {
  private hasUnsavedChanges: boolean = false;

  canDeactivate(): boolean {
    return !this.hasUnsavedChanges;
  }

  private trackFormChanges(): void {
    this.userForm.valueChanges.subscribe(() => {
      if (this.userForm.dirty) {
        this.hasUnsavedChanges = true;
      }
    });
  }
}
Uso:
typescript{ path: 'formulario', component: UserFormComponent, canDeactivate: [unsavedChangesGuard] }

RoleGuard (Proteger por roles)
typescript// guards/role.guard.ts
export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const expectedRole = route.data['role'];
  const userRole = localStorage.getItem('user_role');

  if (userRole === expectedRole) {
    return true;
  } else {
    alert('No tienes permisos');
    router.navigate(['/home']);
    return false;
  }
};
Uso:
typescript{ 
  path: 'admin', 
  component: AdminComponent, 
  canActivate: [roleGuard],
  data: { role: 'admin' }
}

🔒 2. INTERCEPTOR (Añadir token automáticamente)
typescript// interceptors/auth-interceptor.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Si la URL contiene "auth", no añade token (es login)
  if (req.url.includes("auth")) {
    return next(req);
  }
  
  // Clona la request y añade headers
  const cloneRequest = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (localStorage.getItem("access_token") || "")
    }
  });

  return next(cloneRequest);
};
Registrar en app.config.ts:
typescriptexport const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};

🌐 3. SERVICIOS HTTP
Estructura básica de un servicio
typescript@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private baseURL: string = 'https://api.com/users';
  httpClient = inject(HttpClient);

  // GET todos
  async getAllUsers(page: number = 1): Promise<Iapi> {
    return lastValueFrom(
      this.httpClient.get<Iapi>(this.baseURL + '?page=' + page)
    );
  }

  // GET por ID
  async getByID(_id: string): Promise<Iusuario> {
    return lastValueFrom(
      this.httpClient.get<Iusuario>(this.baseURL + '/' + _id)
    );
  }

  // POST (crear)
  async create(usuario: Iusuario): Promise<Iusuario> {
    return lastValueFrom(
      this.httpClient.post<Iusuario>(this.baseURL, usuario)
    );
  }

  // PUT (actualizar)
  async update(usuario: Iusuario): Promise<Iusuario> {
    return lastValueFrom(
      this.httpClient.put<Iusuario>(this.baseURL + '/' + usuario._id, usuario)
    );
  }

  // DELETE
  async delete(_id: string): Promise<Iusuario> {
    return lastValueFrom(
      this.httpClient.delete<Iusuario>(this.baseURL + '/' + _id)
    );
  }
}

🔑 4. LOGIN COMPLETO
login.component.ts
typescriptexport class Login {
  private userLogin = inject(LoginService);
  private router = inject(Router);

  ngOnInit(): void {
    if(localStorage.getItem("access_token")) {
      this.router.navigate(['/home']);
    }
  }

  async getUser(loginForm: NgForm) {
    const loginUser: Ilogin = loginForm.value as Ilogin;

    try {
      let response = await this.userLogin.login(loginUser);
      
      if (response.accessToken && response.refreshToken) {
        localStorage.setItem("access_token", response.accessToken);
        localStorage.setItem("refresh_token", response.refreshToken);
        
        // Opcional: guardar rol
        if (response.role) {
          localStorage.setItem("user_role", response.role);
        }

        this.router.navigate(['/home']);
        loginForm.reset();
      }
    } catch (error: any) {
      console.error('Error de login:', error);
      alert("Credenciales incorrectos");
      loginForm.reset();
    }
  }
}
login.service.ts
typescript@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private httpClient = inject(HttpClient);
  private baseUrl: string = 'https://dummyjson.com/auth/';

  login(user: Ilogin): Promise<any> {
    return lastValueFrom(
      this.httpClient.post<any>(this.baseUrl + "login", user)
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
  }
}

🚀 5. LOGOUT
typescript// En cualquier componente (ej: home.component.ts)
logout(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_role');
  this.router.navigate(['/login']);
}
En el HTML:
html<button (click)="logout()" class="btn btn-danger">Cerrar Sesión</button>

📋 6. FORMULARIOS REACTIVOS
Crear formulario
typescriptexport class UserFormComponent {
  userForm: FormGroup;

  constructor() {
    this.userForm = this.createForm();
  }

  private createForm(): FormGroup {
    return new FormGroup({
      first_name: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  // Verificar errores
  checkControl(formControlName: string, validator: string): boolean | undefined {
    return this.userForm.get(formControlName)?.hasError(validator) &&
           this.userForm.get(formControlName)?.touched;
  }

  // Enviar formulario
  getDataForm() {
    if (this.userForm.invalid) return;
    
    let usuario = this.userForm.value as Iusuario;
    // ... lógica de guardado
  }
}
HTML del formulario
html<form [formGroup]="userForm" (ngSubmit)="getDataForm()">
  
  <input 
    type="text" 
    formControlName="first_name"
    class="form-control">
  
  @if(checkControl('first_name', 'required')){
    <p class="text-danger">Campo requerido</p>
  }
  @if(checkControl('first_name', 'minlength')){
    <p class="text-danger">Mínimo 3 caracteres</p>
  }

  <button type="submit" [disabled]="userForm.invalid">
    Guardar
  </button>
</form>

🛣️ 7. RUTAS COMPLETAS
typescriptexport const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login'},
  { path: 'login', component: Login, canActivate: [loginGuard] },
  
  // Rutas protegidas
  { path: 'home', component: Home, canActivate: [authguardGuard] },
  { 
    path: 'formulario', 
    component: UserFormComponent, 
    canActivate: [authguardGuard],
    canDeactivate: [unsavedChangesGuard]
  },
  { 
    path: 'formulario/:_id', 
    component: UserFormComponent, 
    canActivate: [authguardGuard],
    canDeactivate: [unsavedChangesGuard]
  },
  { path: 'usuarios', component: UserList, canActivate: [authguardGuard] },
  { path: 'usuarios/:_id', component: UserView, canActivate: [authguardGuard] },
  
  // Ruta protegida por rol
  { 
    path: 'admin', 
    component: AdminComponent,
    canActivate: [authguardGuard, roleGuard],
    data: { role: 'admin' }
  },

  { path: '**', component: Page404 }
];

📊 8. MANEJO DE ESTADO DE CARGA
typescriptexport class UserList {
  isLoading: boolean = false;
  usuarios: Iusuario[] = [];

  async loadUsers() {
    this.isLoading = true;
    try {
      const response = await this.usuarioService.getAllUsers();
      this.usuarios = response.results;
    } catch (error) {
      console.error(error);
      alert('Error al cargar usuarios');
    } finally {
      this.isLoading = false;
    }
  }
}
En el HTML:
html@if(isLoading) {
  <p>Cargando...</p>
} @else {
  <div *ngFor="let usuario of usuarios">
    {{ usuario.first_name }}
  </div>
}

🔄 9. PAGINACIÓN
typescriptexport class UserList {
  currentPage: number = 1;
  totalPages: number = 1;

  async loadUsers(page: number = 1) {
    const response = await this.usuarioService.getAllUsers(page);
    this.usuarios = response.results;
    this.currentPage = response.page;
    this.totalPages = response.total_pages;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadUsers(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadUsers(this.currentPage - 1);
    }
  }
}
HTML:
html<button (click)="prevPage()" [disabled]="currentPage === 1">Anterior</button>
<span>Página {{ currentPage }} de {{ totalPages }}</span>
<button (click)="nextPage()" [disabled]="currentPage === totalPages">Siguiente</button>

❌ 10. ELIMINAR CON CONFIRMACIÓN
typescriptasync deleteUser(_id: string) {
  if (confirm('¿Estás seguro de eliminar este usuario?')) {
    try {
      await this.usuarioService.delete(_id);
      alert('Usuario eliminado');
      this.loadUsers(); // Recargar lista
    } catch (error) {
      console.error(error);
      alert('Error al eliminar');
    }
  }
}

🎨 11. INTERFACES TÍPICAS
typescript// iusuario.ts
export interface Iusuario {
  _id?: string;
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  image: string;
  password: string;
}

// ilogin.ts
export interface Ilogin {
  username: string;
  password: string;
  expiresInMins?: number;
}

// iapi.ts (para respuestas paginadas)
export interface Iapi {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  results: Iusuario[];
}

🐛 12. ERRORES COMUNES Y SOLUCIONES
Error: Token no se envía
✅ Verifica que el interceptor esté registrado en app.config.ts
✅ Asegúrate de guardar el token con el nombre correcto: access_token
Error: Guard no funciona
✅ Verifica que esté importado en las rutas
✅ Verifica el nombre del guard (con o sin guiones)
✅ Asegúrate de usar canActivate o canDeactivate según corresponda
Error: Formulario no valida
✅ Verifica que uses formControlName (no name)
✅ Verifica que hayas importado ReactiveFormsModule
✅ Usa this.userForm.invalid para deshabilitar botones
Error: DummyJSON devuelve 401
✅ Usa credenciales válidas: username: "emilys", password: "emilyspass"
✅ Verifica que uses accessToken (camelCase), no access_token

📝 13. COMANDOS ÚTILES
bash# Generar componente
ng g c pages/nombre --skip-tests

# Generar servicio
ng g s services/nombre --skip-tests

# Generar guard
ng g guard guards/nombre --skip-tests

# Generar interceptor
ng g interceptor interceptors/nombre --skip-tests

# Generar interface
ng g interface interfaces/nombre

✅ 14. CHECKLIST PRE-EXAMEN

 AuthGuard implementado y funcionando
 LoginGuard implementado (evita ir a /login si ya estás logueado)
 UnsavedChangesGuard implementado en formularios
 Interceptor añade token automáticamente
 Login guarda access_token, refresh_token y opcionalmente user_role
 Logout elimina todos los tokens
 Formularios reactivos con validaciones
 CRUD completo (Create, Read, Update, Delete)
 Manejo de errores con try-catch
 Paginación funcional
 Confirmaciones antes de eliminar
 Rutas bien estructuradas
 404 para rutas no encontradas


 🔧 Método 1: Paginación desde la API (Recomendado)
La API te devuelve solo los datos de la página actual.
Estructura de respuesta típica de API paginada:
typescript// iapi.ts
export interface Iapi {
  page: number;           // Página actual (ej: 1)
  per_page: number;       // Usuarios por página (ej: 6)
  total: number;          // Total de usuarios en BD (ej: 100)
  total_pages: number;    // Total de páginas (ej: 17)
  results: Iusuario[];    // Array con los usuarios de esta página
}
Servicio:
typescript// usuario.service.ts
async getAllUsers(page: number = 1): Promise<Iapi> {
  return lastValueFrom(
    this.httpClient.get<Iapi>(this.baseURL + '?page=' + page)
  );
}
Componente completo:
typescript// user-list.component.ts
import { Component, inject } from '@angular/core';
import { UsuarioService } from '../../services/usuario-service';
import { Iusuario } from '../../interfaces/iusuario';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.html',
})
export class UserList {
  usuarioService = inject(UsuarioService);
  
  usuarios: Iusuario[] = [];
  currentPage: number = 1;      // Página actual
  totalPages: number = 1;       // Total de páginas
  perPage: number = 6;          // Usuarios por página
  total: number = 0;            // Total de usuarios
  isLoading: boolean = false;

  ngOnInit(): void {
    this.loadUsers(1); // Carga la primera página
  }

  async loadUsers(page: number): Promise<void> {
    this.isLoading = true;
    
    try {
      const response = await this.usuarioService.getAllUsers(page);
      
      this.usuarios = response.results;
      this.currentPage = response.page;
      this.totalPages = response.total_pages;
      this.perPage = response.per_page;
      this.total = response.total;
      
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar los usuarios');
    } finally {
      this.isLoading = false;
    }
  }

  // Ir a la página siguiente
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadUsers(this.currentPage + 1);
    }
  }

  // Ir a la página anterior
  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadUsers(this.currentPage - 1);
    }
  }

  // Ir a una página específica
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadUsers(page);
    }
  }

  // Ir a la primera página
  firstPage(): void {
    this.loadUsers(1);
  }

  // Ir a la última página
  lastPage(): void {
    this.loadUsers(this.totalPages);
  }
}
HTML Básico:
html<!-- user-list.html -->
<div class="container mt-5">
  <h1>Lista de Usuarios</h1>

  <!-- Mostrar loading -->
  @if(isLoading) {
    <div class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  }

  <!-- Lista de usuarios -->
  @if(!isLoading && usuarios.length > 0) {
    <div class="row">
      @for(usuario of usuarios; track usuario._id) {
        <div class="col-md-4 mb-3">
          <div class="card">
            <img [src]="usuario.image" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">{{ usuario.first_name }} {{ usuario.last_name }}</h5>
              <p class="card-text">{{ usuario.email }}</p>
            </div>
          </div>
        </div>
      }
    </div>
  }

  <!-- Si no hay usuarios -->
  @if(!isLoading && usuarios.length === 0) {
    <p class="text-center">No hay usuarios para mostrar</p>
  }

  <!-- Controles de paginación -->
  <nav aria-label="Paginación" class="mt-4">
    <ul class="pagination justify-content-center">
      
      <!-- Botón Primera página -->
      <li class="page-item" [class.disabled]="currentPage === 1">
        <button class="page-link" (click)="firstPage()">
          «
        </button>
      </li>

      <!-- Botón Anterior -->
      <li class="page-item" [class.disabled]="currentPage === 1">
        <button class="page-link" (click)="prevPage()">
          ‹
        </button>
      </li>

      <!-- Número de página actual -->
      <li class="page-item active">
        <span class="page-link">
          {{ currentPage }} / {{ totalPages }}
        </span>
      </li>

      <!-- Botón Siguiente -->
      <li class="page-item" [class.disabled]="currentPage === totalPages">
        <button class="page-link" (click)="nextPage()">
          ›
        </button>
      </li>

      <!-- Botón Última página -->
      <li class="page-item" [class.disabled]="currentPage === totalPages">
        <button class="page-link" (click)="lastPage()">
          »
        </button>
      </li>

    </ul>
  </nav>

  <!-- Información adicional -->
  <p class="text-center text-muted">
    Mostrando {{ usuarios.length }} de {{ total }} usuarios
  </p>
</div>

🎨 HTML con números de página (Bootstrap avanzado):
html<!-- Paginación con números de página -->
<nav aria-label="Paginación">
  <ul class="pagination justify-content-center">
    
    <!-- Primera y Anterior -->
    <li class="page-item" [class.disabled]="currentPage === 1">
      <button class="page-link" (click)="firstPage()">Primera</button>
    </li>
    <li class="page-item" [class.disabled]="currentPage === 1">
      <button class="page-link" (click)="prevPage()">Anterior</button>
    </li>

    <!-- Números de página (mostrar 5 páginas máximo) -->
    @for(pageNum of getPageNumbers(); track pageNum) {
      <li class="page-item" [class.active]="pageNum === currentPage">
        <button class="page-link" (click)="goToPage(pageNum)">
          {{ pageNum }}
        </button>
      </li>
    }

    <!-- Siguiente y Última -->
    <li class="page-item" [class.disabled]="currentPage === totalPages">
      <button class="page-link" (click)="nextPage()">Siguiente</button>
    </li>
    <li class="page-item" [class.disabled]="currentPage === totalPages">
      <button class="page-link" (click)="lastPage()">Última</button>
    </li>

  </ul>
</nav>
Método para generar números de página:
typescript// En user-list.component.ts

getPageNumbers(): number[] {
  const pages: number[] = [];
  const maxPagesToShow = 5; // Mostrar máximo 5 números de página
  
  let startPage = Math.max(1, this.currentPage - 2);
  let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
  
  // Ajustar si estamos cerca del final
  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
}