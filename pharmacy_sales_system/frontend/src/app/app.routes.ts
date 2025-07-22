import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { ProductoCreate } from './componentes/producto-create/producto-create';
import { ProductoEdit } from './componentes/producto-edit/producto-edit';
import { ProductoList } from './componentes/producto-list/producto-list';
import { Home } from './componentes/home/home';
import { Login } from './componentes/login/login';


export const routes: Routes = [
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'productos', component: ProductoList, canActivate: [AuthGuard] },
  { path: 'productos/nuevo', component: ProductoCreate, canActivate: [AuthGuard] },
  { path: 'productos/editar/:id', component: ProductoEdit, canActivate: [AuthGuard] },
  { path: '', component: Login }, 
  { path: '**', redirectTo: '' },
];
