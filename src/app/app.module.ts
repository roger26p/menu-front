import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Components
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { DeleteMenuDialog } from './menu/deletemenu.component';
import { UpdateMenuDialog } from './menu/updatemenu.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { PedirDialog } from './pedidos/pedir.component';

//Routes
import { RouterModule, Routes } from '@angular/router';

//Form
import { FormsModule, ReactiveFormsModule, FormControlDirective } from '@angular/forms';

//Material
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';

//Http
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'pedidos', component: PedidosComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    DeleteMenuDialog,
    UpdateMenuDialog,
    PedidosComponent,
    PedirDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpModule,
    HttpClientJsonpModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatRadioModule
  ],
  exports: [RouterModule],
  providers: [HttpClientModule, MatDatepickerModule],
  entryComponents: [DeleteMenuDialog, UpdateMenuDialog, PedirDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
