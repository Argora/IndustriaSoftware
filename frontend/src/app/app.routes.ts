import { RouterModule, Routes } from "@angular/router";
import { InicioComponent } from "./components/inicio/inicio.component"; 
import { LoginComponent } from "./components/login/login.component";
import { RegistroComponent } from "./components/registro/registro.component";
import { RecuperarComponent } from "./components/recuperar/recuperar.component";
import  { FormContraseComponent } from "./components/form-contrase/form-contrase.component";
import { RegistrarProductoComponent } from "./components/registrar-producto/registrar-producto.component";
import {ProductosComponent} from "./components/productos/productos.component";
import {MisProductosComponent} from "./components/mis-productos/mis-productos.component";
import { ProductDetailComponent } from "./components/product-detail/product-detail.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { SellerProfileComponent } from "./components/seller-profile/seller-profile.component";
import { ChatComponent } from "./components/chat/chat.component";
import { CategoriesComponent } from "./components/categories/categories.component";
import { ComplaintsComponent } from "./components/complaints/complaints.component";
import { ComplaintsHistoryComponent } from "./components/complaints-history/complaints-history.component";


const app_routes: Routes =[
    {path: 'inicio', component: InicioComponent},
    {path: 'form-contrase', component: FormContraseComponent},
    {path:'login/registro', component: RegistroComponent},
    {path: 'login', component: LoginComponent},
    {path: 'login/recuperar', component: RecuperarComponent},
    {path: 'registrarProducto', component: RegistrarProductoComponent},
    {path: 'producto', component: ProductosComponent},
    {path: 'misProductos', component: MisProductosComponent},
    {path: 'producto/detalle/:id', component: ProductDetailComponent},
    {path: 'perfil', component: ProfileComponent},
    {path: 'vendedor/:id', component: SellerProfileComponent},
    {path: 'chat', component: ChatComponent},
    {path: 'categorias', component: CategoriesComponent},
    {path: 'denuncias', component: ComplaintsComponent},
    {path: 'denuncias/resueltas', component: ComplaintsHistoryComponent},
    {path:'**', pathMatch:'full', redirectTo:'inicio'}
];

export const app_routing =RouterModule.forRoot(app_routes);

