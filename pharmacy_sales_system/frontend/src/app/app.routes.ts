import { Routes } from '@angular/router';
import { ProductoCreate } from './componentes/producto-create/producto-create';
import { ProductoEdit } from './componentes/producto-edit/producto-edit';
import { ProductoList } from './componentes/producto-list/producto-list';
import { Home } from './componentes/home/home';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'productos', component: ProductoList },
    { path: 'productos/nuevo', component: ProductoCreate },
    { path: 'productos/editar/:id', component: ProductoEdit },
];
